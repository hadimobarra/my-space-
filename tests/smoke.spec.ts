import { expect, test } from "@playwright/test";
import { pages } from "./pages";

for (const path of pages) {
  test(`${path} loads without errors or horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

    await page.goto(path, { waitUntil: "networkidle" });
    const fa = path.startsWith("/fa/");
    await expect(page.locator("html")).toHaveAttribute("lang", fa ? "fa" : "en");
    await expect(page.locator("html")).toHaveAttribute("dir", fa ? "rtl" : "ltr");
    await expect(page.locator("h1")).toHaveCount(1);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("content is readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  for (const id of ["about", "projects", "experience", "open-source", "skills", "blog", "testimonials", "contact"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("h2")).toBeVisible();
  }
  await context.close();
});

test("the language switch keeps the page and survives a reload", async ({ page }) => {
  await page.goto("/resume/");
  await page.getByRole("link", { name: /Switch to Persian/ }).click();
  await expect(page).toHaveURL("/fa/resume/");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await page.getByRole("link", { name: /English/ }).click();
  await expect(page).toHaveURL("/resume/");
});

test("unknown URLs get the 404 page", async ({ page }) => {
  const response = await page.goto("/nope/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
