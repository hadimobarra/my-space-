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

test("upload demo resumes from the server's offset after a dropped connection", async ({ page, baseURL }) => {
  const outside: string[] = [];
  page.on("request", (r) => new URL(r.url()).origin !== new URL(baseURL!).origin && !r.url().startsWith("blob:") && outside.push(r.url()));

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

test("full-text search finds words that appear only in an article's body", async ({ page }) => {
  await page.goto("/blog/", { waitUntil: "networkidle" });
  await page.getByRole("textbox").fill("preserveDrawingBuffer");
  await expect(page.locator("main h2").filter({ hasText: "Why Safari Exported Blank Charts" })).toBeVisible();

  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("preserveDrawingBuffer");
  await page.getByRole("option", { name: /Why Safari Exported Blank Charts/ }).click();
  await expect(page).toHaveURL("/blog/safari-blank-chart-exports/");
});

test("Persian search covers Persian and English articles", async ({ page }) => {
  await page.goto("/fa/blog/", { waitUntil: "networkidle" });
  await page.getByRole("textbox").fill("یونیکد");
  await expect(page.locator("main h2", { hasText: "راست‌به‌چپ" })).toBeVisible();
  await page.getByRole("textbox").fill("preserveDrawingBuffer");
  await expect(page.locator("main h2", { hasText: "Why Safari" })).toBeVisible();
});

test("event loop demo ends with the order the article claims", async ({ page }) => {
  await page.goto("/blog/javascript-event-loop-deep-dive/", { waitUntil: "networkidle" });
  const demo = page.getByRole("region", { name: "Step through the event loop" });
  const next = demo.getByRole("button", { name: "Next step" });
  while (await next.isEnabled()) await next.click();
  const order = await demo.locator("li", { hasText: /^(script|end|A|5|B|timeout)$/ }).allInnerTexts();
  expect(order.slice(-6)).toEqual(["script", "end", "A", "5", "B", "timeout"]);

  // The same code, run by a real engine
  const real = await page.evaluate(
    () =>
      new Promise<string[]>((resolve) => {
        const log: string[] = [];
        log.push("script");
        setTimeout(() => {
          log.push("timeout");
          resolve(log);
        }, 0);
        Promise.resolve().then(() => log.push("A")).then(() => log.push("B"));
        queueMicrotask(() => log.push("5"));
        log.push("end");
      })
  );
  expect(real).toEqual(order.slice(-6));
});

test("signals demo runs only what depends on a change", async ({ page }) => {
  await page.goto("/blog/build-signals-from-scratch/", { waitUntil: "networkidle" });
  const demo = page.getByRole("region", { name: "Signals playground" });
  const rows = demo.locator("li");
  await expect(rows).toContainText([/40.*computed ran 1×/, /ran 1×/, /gift.*ran 1×/]);
  await demo.getByRole("button", { name: "price + 5" }).click();
  await expect(rows).toContainText([/50.*computed ran 2×/, /ran 2×/, /ran 1×/]);
  await demo.getByRole("button", { name: "change note" }).click();
  await expect(rows).toContainText([/computed ran 2×/, /ran 2×/, /express.*ran 2×/]);
  await demo.getByRole("button", { name: "same value" }).click();
  await expect(rows).toContainText([/computed ran 2×/, /ran 2×/, /ran 2×/]);
});

test("INP demo shows that yielding reaches the next frame sooner", async ({ page }) => {
  await page.goto("/blog/taming-inp-interaction-to-next-paint/", { waitUntil: "networkidle" });
  const demo = page.getByRole("region", { name: "Feel the difference" });
  const result = async (index: number) => {
    const text = await demo.getByRole("status").nth(index).filter({ hasText: /\d+ ms/ }).innerText();
    return Number(text.match(/(\d+) ms/)![1]);
  };
  await demo.getByRole("button", { name: /Block/ }).click();
  const blocked = await result(0);
  await demo.getByRole("button", { name: /Paint first/ }).click();
  const chunked = await result(1);
  expect(blocked).toBeGreaterThanOrEqual(400);
  expect(chunked).toBeLessThan(blocked / 2);
});

test("RTL demo: logical properties move the accent to the reading edge", async ({ page }) => {
  await page.goto("/blog/rtl-is-not-a-translation-step/", { waitUntil: "networkidle" });
  const demo = page.getByRole("region", { name: "Physical or logical?" });
  const box = demo.getByTestId("rtl-preview").locator("> div");
  const widths = () => box.evaluate((el) => [getComputedStyle(el).borderLeftWidth, getComputedStyle(el).borderRightWidth]);
  expect(await widths()).toEqual(["4px", "0px"]); // physical: wrong side in RTL
  await demo.getByRole("button", { name: "Logical properties" }).click();
  expect(await widths()).toEqual(["0px", "4px"]);
});

test("feeds carry full article text", async ({ request }) => {
  for (const [path, phrase] of [["/rss.xml", "preserveDrawingBuffer"], ["/fa/rss.xml", "یونیکد"]]) {
    const xml = await (await request.get(path)).text();
    expect(xml).toContain("<content:encoded>");
    expect(xml).toContain(phrase);
    expect(xml).not.toContain("<embed-slot");
  }
});

test("catalog filters claims by trust and links to proof", async ({ page }) => {
  await page.goto("/catalog/", { waitUntil: "networkidle" });
  const items = page.locator("main li[id]");
  const total = await items.count();
  await page.getByRole("button", { name: "My word" }).click();
  expect(await items.count()).toBeLessThan(total);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByRole("textbox").fill("webgl");
  await expect(items).toHaveCount(1);
  await expect(items.getByRole("link", { name: /Pull request #44529/ })).toBeVisible();
});

test("job fit separates proof, word and gaps without sending anything", async ({ page, baseURL }) => {
  const outside: string[] = [];
  page.on("request", (r) => (r.method() === "POST" || new URL(r.url()).origin !== new URL(baseURL!).origin) && outside.push(r.url()));
  await page.goto("/fit/", { waitUntil: "networkidle" });
  await page.getByLabel("Job description").fill("We need React, TypeScript and Redux Saga, 6+ years, plus Angular and Kubernetes. Java is not needed but JavaScript is.");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("heading", { name: /With proof \(3\)/ })).toBeVisible();
  await expect(page.getByText("Redux Saga", { exact: true })).toBeVisible();
  const missing = page.locator("section", { hasText: "Not in my catalog" }).last();
  await expect(missing).toContainText("Angular");
  await expect(missing).toContainText("Kubernetes");
  await expect(page.getByText("less than the posting asks for")).toBeVisible();
  expect(outside).toEqual([]);
});

test("the direction slider reveals the Persian panel from the keyboard", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const slider = page.getByRole("slider", { name: /Compare the English and Persian/ });
  await slider.focus();
  const before = await slider.inputValue();
  await page.keyboard.press("ArrowLeft");
  expect(await slider.inputValue()).not.toBe(before);
  await expect(page.locator('#directions [lang="fa"][dir="rtl"]')).toContainText("سفارش‌ها");
});
