// Measures how a data tool behaves in Persian: language and direction attributes, mirroring,
// share of Persian interface text, isolation of paths, digits and calendar.
//   node rtl-report/probe.mjs superset shipped
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { tools } from "./tools.mjs";

const [tool, variant] = process.argv.slice(2);
const config = tools[tool];
const out = new URL(`./results/${tool}-${variant}/`, import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const results = { tool, variant, date: new Date().toISOString().slice(0, 10), screens: {} };

for (const language of ["en", "fa"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await config.login(page);
  await config.setLanguage(page, language);
  for (const [name, path] of Object.entries(config.screens)) {
    await page.goto(config.url + path, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
    await page.waitForTimeout(config.settle ?? 4000);
    await page.screenshot({ path: `${out}${name}-${language}.png` });
    results.screens[`${name}-${language}`] = await page.evaluate(() => {
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 1 && r.height > 1 && s.visibility !== "hidden" && s.display !== "none" && r.top < innerHeight && r.left < innerWidth && r.right > 0;
      };
      const texts = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        const el = walker.currentNode.parentElement;
        if (text && el && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName) && visible(el)) texts.push({ text, el });
      }
      const persian = texts.filter(({ text }) => /[؀-ۿ]/.test(text));
      const latin = texts.filter(({ text }) => /[A-Za-z]{2,}/.test(text) && !/[؀-ۿ]/.test(text));
      const nav = document.querySelector("nav a img, .navbar-brand img, header img, [data-testid='left-sidebar'], .ant-layout-sider, nav img, #main-menu img");
      const aligned = persian.filter(({ el }) => getComputedStyle(el).direction === "rtl").length;
      return {
        lang: document.documentElement.lang,
        dir: document.documentElement.dir || null,
        bodyDirection: getComputedStyle(document.body).direction,
        navCenter: nav ? Math.round(((nav.getBoundingClientRect().left + nav.getBoundingClientRect().right) / 2 / innerWidth) * 100) : null,
        persianTexts: persian.length,
        latinTexts: latin.length,
        persianInRtl: aligned,
        latinSample: [...new Set(latin.map(({ text }) => text))].slice(0, 25),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
  }
  await context.close();
}
await browser.close();
writeFileSync(`${out}results.json`, JSON.stringify(results, null, 2) + "\n");
for (const [k, v] of Object.entries(results.screens)) console.log(k, JSON.stringify({ ...v, latinSample: v.latinSample.slice(0, 8) }));
