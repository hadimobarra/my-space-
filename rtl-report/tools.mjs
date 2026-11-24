export const tools = {
  superset: {
    url: process.env.SUPERSET_URL ?? "http://127.0.0.1:8088",
    settle: 6000,
    screens: { home: "/superset/welcome/", charts: "/chart/list/", dashboard: "/superset/dashboard/1/", explore: "/explore/?slice_id=1", sqllab: "/sqllab/" },
    async login(page) {
      await page.goto(this.url + "/login/", { waitUntil: "networkidle" });
      await page.locator("#username, input[name=username]").first().fill("admin");
      await page.locator("#password, input[name=password]").first().fill("admin");
      await page.locator("button[type=submit], input[type=submit], [data-test=login-button]").first().click();
      await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });
    },
    async setLanguage(page, language) {
      await page.goto(`${this.url}/lang/${language}`, { waitUntil: "networkidle" });
    },
  },
  openmetadata: {
    url: process.env.OM_URL ?? "http://127.0.0.1:8585",
    settle: 6000,
    screens: { home: "/my-data", explore: "/explore", settings: "/settings", glossary: "/glossary", quality: "/data-quality/test-cases" },
    async login(page) {
      await page.goto(this.url + "/signin", { waitUntil: "networkidle" });
      await page.locator("#email").fill("admin@open-metadata.org");
      await page.locator("#password").fill("admin");
      await page.locator("[data-testid=login], button[type=submit]").first().click();
      await page.waitForURL((u) => !u.pathname.startsWith("/signin"), { timeout: 45_000 });
      await page.waitForTimeout(4000);
    },
    async setLanguage(page, language) {
      // The product's own language menu. Persian is registered there as pr-PR; its ISO code is fa.
      await page.goto(this.url + "/my-data", { waitUntil: "networkidle" });
      if (language === "en") return;
      await page.locator("[data-testid=language-selector-button]").click();
      await page.waitForTimeout(1500);
      const items = page.locator("[role=menuitem], .ant-dropdown-menu-item");
      console.log("languages:", (await items.allInnerTexts()).join(" | "));
      await items.filter({ hasText: /فارسی|Persian|Farsi/ }).first().click({ timeout: 8000 });
      await page.waitForTimeout(6000);
    },
  },
};
