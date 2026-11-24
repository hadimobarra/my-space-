import { getDictionary } from "./dictionary";
import { localePath, type Locale } from "./locale";
import { getAllPosts, renderMdxToHtml, splitEmbeds } from "./mdx";
import { absoluteUrl, siteConfig } from "./seo";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Article HTML for feed readers: no copy buttons, absolute links, and a pointer where a demo or diagram would be. */
async function feedHtml(content: string, url: string, locale: Locale) {
  const note = locale === "fa" ? "این بخش را در سایت ببینید" : "View this part on the site";
  const html = splitEmbeds(await renderMdxToHtml(content))
    .map((part, i) => (i % 2 === 0 ? part : `<p><a href="${url}">${note}</a></p>`))
    .join("");
  return html
    .replace(/<button[\s\S]*?<\/button>/g, "")
    .replace(/(href|src)="\//g, `$1="${siteConfig.url}/`)
    .replace(/href="#/g, `href="${url}#`)
    .replace(/]]>/g, "]]&gt;");
}

export async function rssFeed(locale: Locale): Promise<Response> {
  const t = getDictionary(locale);
  const posts = getAllPosts(locale);
  const items = await Promise.all(
    posts.map(async ({ slug, content, frontmatter }) => {
      const url = absoluteUrl(localePath(locale, `/blog/${slug}/`));
      return `    <item>
      <title>${escape(frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>
      <description>${escape(frontmatter.description)}</description>
${frontmatter.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
      <content:encoded><![CDATA[${await feedHtml(content, url, locale)}]]></content:encoded>
    </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(`${t.hero.name} — ${t.blog.title}`)}</title>
    <link>${absoluteUrl(localePath(locale, "/blog/"))}</link>
    <description>${escape(t.seo.blogDescription)}</description>
    <language>${locale}</language>
    <atom:link href="${absoluteUrl(localePath(locale, "/rss.xml"))}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
