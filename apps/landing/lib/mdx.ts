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
}

export interface BlogPostData {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: number;
}

export type Post = BlogPostData;

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
