import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import readingTime from "reading-time";
import type { Locale } from "./locale";
import { rehypeCodeBlocks, rehypeEmbeds } from "./rehype-code-blocks";

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  /** Date of the last meaningful revision. */
  updated?: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogPostData {
  slug: string;
  locale: Locale;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
}

/** Post data without the body. */
export type PostMeta = Omit<BlogPostData, "content">;

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** English articles live in content/blog, translations in content/blog/fa under the same file name. */
const postsDirectory = (locale: Locale) => path.join(process.cwd(), "content/blog", locale === "en" ? "" : locale);

export const postSourcePath = (slug: string, locale: Locale) => `content/blog/${locale === "en" ? "" : `${locale}/`}${slug}.mdx`;

export function getAllPostSlugs(locale: Locale = "en"): string[] {
  return fs.readdirSync(postsDirectory(locale)).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

const cache = new Map<string, BlogPostData>();

export function getPostBySlug(slug: string, locale: Locale = "en"): BlogPostData | null {
  const key = `${locale}/${slug}`;
  const cached = process.env.NODE_ENV === "production" && cache.get(key);
  if (cached) return cached;
  const file = path.join(postsDirectory(locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const post = { slug, locale, frontmatter: data as BlogFrontmatter, content, readingTime: Math.ceil(readingTime(content).minutes) };
  cache.set(key, post);
  return post;
}

export function getAllPosts(locale: Locale = "en"): BlogPostData[] {
  return getAllPostSlugs(locale)
    .map((slug) => getPostBySlug(slug, locale))
    .filter((p): p is BlogPostData => p !== null)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date) || a.slug.localeCompare(b.slug));
}

export function getAllPostMeta(locale: Locale = "en"): PostMeta[] {
  return getAllPosts(locale).map(({ slug, locale, frontmatter, readingTime }) => ({ slug, locale, frontmatter, readingTime }));
}

/** What a blog index shows: posts in the reader's language first, then English ones without a translation. */
export function getPostListing(locale: Locale): PostMeta[] {
  if (locale === "en") return getAllPostMeta();
  const own = getAllPostMeta(locale);
  const translated = new Set(own.map((p) => p.slug));
  return [...own, ...getAllPostMeta().filter((p) => !translated.has(p.slug))];
}

/** Older/newer neighbours in date order (posts are sorted newest first). */
export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPostMeta();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: posts[i + 1] ?? null, next: posts[i - 1] ?? null };
}

/** Posts ranked by number of shared tags, falling back to most recent. */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const posts = getAllPostMeta();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  const tags = new Set(current.frontmatter.tags);
  const shared = (p: PostMeta) => p.frontmatter.tags.filter((t) => tags.has(t)).length;
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, limit);
}

export async function renderMdxToHtml(mdxContent: string, copyLabel = "Copy code"): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeEmbeds)
    .use(rehypeHighlight, { detect: true, plainText: ["text", "txt"] })
    .use(rehypeCodeBlocks, { copyLabel })
    .use(rehypeStringify)
    .process(mdxContent);

  return result.toString();
}

const EMBED = /<embed-slot name="([\w-]+)"><\/embed-slot>/g;

/** Article HTML cut at its ```embed blocks: [html, name, html, name, …, html]. */
export function splitEmbeds(html: string): string[] {
  return html.split(EMBED);
}

/** Pull h2/h3 headings (with rehype-slug ids) out of rendered HTML for a TOC. */
export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = m[3]
      .replace(/<[^>]+>/g, "")
      .replace(/&#x26;|&amp;/g, "&")
      .replace(/&#x3C;|&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .trim();
    headings.push({ id: m[2], text, level: Number(m[1]) as 2 | 3 });
  }
  return headings;
}
