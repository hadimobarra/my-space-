// Full-text search indexes, one bundle per language. Pagefind can't search two languages from
// one bundle, and Persian pages search both, because most articles are in English.
import { execFileSync } from "node:child_process";

const indexes = [
  { language: "en", glob: "{blog,projects,notes,glossary}/**/*.html" },
  { language: "fa", glob: "fa/**/*.html" },
];

for (const { language, glob } of indexes) {
  execFileSync("node_modules/.bin/pagefind", ["--site", "out", "--glob", glob, "--output-subdir", `pagefind/${language}`, "--force-language", language, "--quiet"], { stdio: "inherit" });
}
