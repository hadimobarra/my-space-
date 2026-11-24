import { expect, test } from "@playwright/test";

test("command menu opens from the keyboard, filters and navigates", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const dialog = page.getByRole("dialog");
  // The first press can come before hydration; pressing again is harmless.
  await expect(async () => {
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.keyboard.type("résumé");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/resume/");
  await expect(dialog).toBeHidden();

  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
});

test("blog search and topic filter", async ({ page }) => {
  await page.goto("/blog/");
  const cards = page.locator("main h2");
  const total = await cards.count();
  await page.getByRole("textbox").fill("signals");
  await expect(cards.first()).toContainText(/signals/i);
  expect(await cards.count()).toBeLessThan(total);
  await page.getByRole("textbox").fill("no such article");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(cards).toHaveCount(total);
});

test("code blocks can be copied", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/blog/javascript-event-loop-deep-dive/", { waitUntil: "networkidle" });
  const block = page.locator(".code-block").first();
  await block.getByRole("button", { name: "Copy code" }).click();
  await expect(page.getByText("Code copied")).toBeAttached();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.trim()).toBe((await block.locator("pre").innerText()).trim());
});

test("contact form falls back to a pre-filled email when sending fails", async ({ page }) => {
  await page.route("https://api.web3forms.com/**", (route) => route.fulfill({ status: 500, body: "{}" }));
  await page.goto("/#contact", { waitUntil: "networkidle" });
  await page.getByLabel("Your Name").fill("Test Visitor");
  await page.getByLabel("Your Email").fill("visitor@example.com");
  await page.getByLabel("Subject").fill("Hello");
  await page.getByLabel("Your Message").fill("Line one");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByRole("link", { name: "Email instead" })).toHaveAttribute("href", /^mailto:.*Line%20one/);
});

test("working hours are shown in the visitor's time zone", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ timezoneId: "Asia/Dubai", baseURL }); // UTC+4, no DST
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#contact")).toContainText("09:30–18:30");
  await expect(page.locator("#contact")).toContainText("8.5 h overlap");
  await context.close();
});

test("upload demo resumes from the server's offset after a dropped connection", async ({ page }) => {
  const outside: string[] = [];
  page.on("request", (r) => new URL(r.url()).hostname !== "127.0.0.1" && !r.url().startsWith("blob:") && outside.push(r.url()));

  await page.goto("/projects/resumable-uploads/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start the demo" }).click();
  await page.getByRole("button", { name: /Upload a 48 MB/ }).click();
  const phase = page.getByTestId("upload-phase");
  const progress = page.getByRole("progressbar");
  const value = async () => Number(await progress.getAttribute("aria-valuenow"));
  await expect.poll(value).toBeGreaterThan(10);

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(phase).toHaveAttribute("data-phase", "paused");
  const paused = await value();
  await page.waitForTimeout(700);
  expect(await value()).toBe(paused);
  await page.getByRole("button", { name: "Resume" }).click();
  await expect.poll(value).toBeGreaterThan(paused);

  await page.getByRole("button", { name: "Drop the connection" }).click();
  await expect(phase).toHaveAttribute("data-phase", "retrying");
  await expect(phase).toHaveAttribute("data-phase", "uploading", { timeout: 10_000 });

  // Every PATCH must start at exactly the offset the last HEAD reported.
  const log = await page.getByRole("list", { name: "Protocol log" }).locator("li").allInnerTexts();
  const lines = log.map((line) => line.replace(/\s+/g, " "));
  const reported = [...lines].reverse().find((l) => /^HEAD 200/.test(l))?.match(/(\d+)$/)?.[1];
  const continued = [...lines].reverse().find((l) => /sending from offset/.test(l))?.match(/(\d+)$/)?.[1];
  expect(Number(reported)).toBeGreaterThan(0);
  expect(continued).toBe(reported);

  await expect(phase).toHaveAttribute("data-phase", "done", { timeout: 25_000 });
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  expect(outside).toEqual([]);
});
