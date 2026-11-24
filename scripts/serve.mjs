// Serves ./out the way GitHub Pages does: directory indexes, gzip and 404.html.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".pdf": "application/pdf",
};

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  let file = join(root, path);
  if (!file.startsWith(root)) file = join(root, "404.html");
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  const found = existsSync(file);
  if (!found) file = join(root, "404.html");

  const type = types[extname(file)] ?? "application/octet-stream";
  const gzip = /text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(found ? 200 : 404, { "Content-Type": type, "Cache-Control": "max-age=600", ...(gzip && { "Content-Encoding": "gzip" }) });
  const stream = createReadStream(file);
  if (gzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}).listen(port, () => console.log(`http://127.0.0.1:${port}`));
