// Fails when a page ships more JavaScript than its budget. Run after `npm run build`.
// Counts what the HTML loads up front, gzipped, without the legacy polyfills modern browsers skip.
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 170;
const PAGES = ["index.html", "fa/index.html", "blog/index.html", "blog/javascript-event-loop-deep-dive/index.html", "projects/resumable-uploads/index.html", "resume/index.html"];

let failed = false;
for (const page of PAGES) {
  const html = readFileSync(`out/${page}`, "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*>/g)].filter(([tag]) => !/nomodule/i.test(tag)).map(([, src]) => src);
  const files = [...new Set(scripts)].map((src) => `out${src}`).filter(existsSync);
  const kb = files.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0) / 1024;
  const over = kb > BUDGET_KB || files.length === 0;
  failed ||= over;
  console.log(`${over ? "✗" : "✓"} ${page}: ${kb.toFixed(1)} KB JS in ${files.length} files (budget ${BUDGET_KB} KB), HTML ${(gzipSync(html).length / 1024).toFixed(1)} KB`);
}
process.exit(failed ? 1 : 0);
