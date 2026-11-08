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

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogPostData {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
}

export type Post = BlogPostData;

/** Post data without the body — safe and cheap to pass to client components. */
export type PostMeta = Omit<BlogPostData, "content">;

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const filenames = fs.readdirSync(postsDirectory);
  return filenames
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => name.replace(/\.(mdx|md)$/, ""));
}

export function getPostBySlug(slug: string): BlogPostData | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  let filePath: string | null = null;
  if (fs.existsSync(mdxPath)) filePath = mdxPath;
  else if (fs.existsSync(mdPath)) filePath = mdPath;
  else return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
    readingTime: Math.ceil(stats.minutes),
  };
}

export function getAllPosts(): BlogPostData[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPostData => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
  return posts;
}

export async function renderMdxToHtml(mdxContent: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(mdxContent);

  return result.toString();
}

export function getAllPostMeta(): PostMeta[] {
  return getAllPosts().map(({ slug, frontmatter, readingTime }) => ({ slug, frontmatter, readingTime }));
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
  const tags = new Set(current.frontmatter.tags.map((t) => t.toLowerCase()));
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.frontmatter.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
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
