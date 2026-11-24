import { getDictionary } from "./dictionary";
import { localePath, type Locale } from "./locale";
import { getAllPosts, renderMdxToHtml, splitEmbeds } from "./mdx";
import { getNotes } from "./notes";
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

interface FeedItem {
  title: string;
  url: string;
  date: string;
  description?: string;
  categories?: string[];
  html: string;
}

function feed(locale: Locale, title: string, description: string, page: string, self: string, items: FeedItem[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(title)}</title>
    <link>${absoluteUrl(localePath(locale, page))}</link>
    <description>${escape(description)}</description>
    <language>${locale}</language>
    <atom:link href="${absoluteUrl(localePath(locale, self))}" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
${item.description ? `      <description>${escape(item.description)}</description>\n` : ""}${(item.categories ?? []).map((c) => `      <category>${escape(c)}</category>\n`).join("")}      <content:encoded><![CDATA[${item.html}]]></content:encoded>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

export async function rssFeed(locale: Locale): Promise<Response> {
  const t = getDictionary(locale);
  const items = await Promise.all(
    getAllPosts(locale).map(async ({ slug, content, frontmatter }) => {
      const url = absoluteUrl(localePath(locale, `/blog/${slug}/`));
      return { title: frontmatter.title, url, date: frontmatter.date, description: frontmatter.description, categories: frontmatter.tags, html: await feedHtml(content, url, locale) };
    })
  );
  return feed(locale, `${t.hero.name} — ${t.blog.title}`, t.seo.blogDescription, "/blog/", "/rss.xml", items);
}

export async function notesFeed(locale: Locale): Promise<Response> {
  const t = getDictionary(locale);
  const items = await Promise.all(
    getNotes(locale).map(async (note) => {
      const url = absoluteUrl(`${localePath(locale, "/notes/")}#${note.id}`);
      return { title: note.title, url, date: note.date, html: await feedHtml(note.content, url, locale) };
    })
  );
  return feed(locale, `${t.hero.name} — ${t.nav.notes}`, t.nav.notes, "/notes/", "/notes/rss.xml", items);
}
