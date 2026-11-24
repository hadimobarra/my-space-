import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const SITE = "https://hadimobarra.github.io";
const OUT = join(process.cwd(), "out");

const htmlFiles = readdirSync(OUT, { recursive: true, encoding: "utf8" })
  .filter((f) => f.endsWith("index.html") && !/^(404|_not-found)\//.test(f))
  .map((f) => ({ path: `/${f.replace(/index\.html$/, "")}`, html: readFileSync(join(OUT, f), "utf8") }));

const attribute = (html: string, pattern: RegExp) => html.match(pattern)?.[1];

/** Exported file behind a site path. */
const fileFor = (path: string) => join(OUT, path.endsWith("/") ? `${path}index.html` : path);

test("every page has a correct canonical, social image and RSS link", () => {
  expect(htmlFiles.length).toBeGreaterThan(25);
  for (const { path, html } of htmlFiles) {
    expect.soft(attribute(html, /rel="canonical" href="([^"]+)"/), path).toBe(`${SITE}${path}`);
    expect.soft(html, path).toContain('type="application/rss+xml"');
    for (const pattern of [/property="og:image" content="([^"]+)"/, /name="twitter:image" content="([^"]+)"/]) {
      const image = attribute(html, pattern);
      expect.soft(image, path).toMatch(new RegExp(`^${SITE}/`));
      expect.soft(existsSync(fileFor(image?.replace(SITE, "") ?? "/missing")), `${path} → ${image}`).toBe(true);
    }
  }
});

test("hreflang links are reciprocal", () => {
  for (const { path, html } of htmlFiles) {
    for (const [, lang, href] of html.matchAll(/rel="alternate" hrefLang="(en|fa)" href="([^"]+)"/gi)) {
      const target = htmlFiles.find((f) => `${SITE}${f.path}` === href);
      expect.soft(target, `${path} → ${lang} ${href}`).toBeTruthy();
      expect.soft(target?.html, `${href} links back`).toContain(`href="${SITE}${path}"`);
    }
  }
});

test("sitemap lists existing canonical URLs only", () => {
  const xml = readFileSync(join(OUT, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  expect(urls.sort()).toEqual(htmlFiles.map((f) => `${SITE}${f.path}`).sort());
});

test("internal links, anchors and assets resolve", () => {
  for (const { path, html } of htmlFiles) {
    for (const [, url] of html.matchAll(/(?:href|src|srcSet)="((?:\/|#)[^"]*)"/gi)) {
      const { pathname, hash } = new URL(url.replace(/&amp;/g, "&"), `${SITE}${path}`);
      const file = fileFor(decodeURIComponent(pathname));
      expect.soft(existsSync(file), `${path} → ${url}`).toBe(true);
      if (hash && file.endsWith(".html") && existsSync(file)) {
        expect.soft(readFileSync(file, "utf8"), `${path} → ${url}`).toContain(`id="${decodeURIComponent(hash.slice(1))}"`);
      }
    }
  }
});

test("manifest icons exist", () => {
  const manifest = JSON.parse(readFileSync(join(OUT, "manifest.webmanifest"), "utf8"));
  for (const icon of manifest.icons) expect(existsSync(fileFor(icon.src)), icon.src).toBe(true);
});
