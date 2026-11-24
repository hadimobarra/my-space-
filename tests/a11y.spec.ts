import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages } from "./pages";

for (const theme of ["light", "dark"]) {
  for (const path of pages) {
    test(`${path} has no WCAG A/AA violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(path, { waitUntil: "networkidle" });
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(violations.map((v) => ({ rule: v.id, nodes: v.nodes.slice(0, 4).map((n) => `${n.target} ${n.any[0]?.message ?? ""}`) }))).toEqual([]);
    });
  }
}
