import { getAllPostMeta } from "@/lib/mdx";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getAllPostMeta();
  const items = posts
    .map((p) => {
      const url = `${siteConfig.url}/blog/${p.slug}/`;
      return `    <item>
      <title>${escape(p.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(p.frontmatter.date).toUTCString()}</pubDate>
      <description>${escape(p.frontmatter.description)}</description>
${p.frontmatter.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/blog/</link>
    <description>Articles on advanced JavaScript, React, TypeScript and front-end engineering.</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
