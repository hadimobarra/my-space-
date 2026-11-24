import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./locale";

export interface ProjectFrontmatter {
  title: string;
  /** One or two sentences for cards and search results. */
  summary: string;
  role: string;
  context: string;
  status: string;
  order: number;
  /** Label drawn on the cover. */
  cover: string;
  tags: string[];
  links?: { label: string; url: string }[];
  /** Proprietary work without public code. */
  confidential?: boolean;
  /** Interactive demo rendered under the article. */
  demo?: "upload";
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

const directory = (locale: Locale) => path.join(process.cwd(), "content/projects", locale);

export function getProjectSlugs(): string[] {
  return fs.readdirSync(directory("en")).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

export function getProject(locale: Locale, slug: string): Project | null {
  const file = path.join(directory(locale), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { slug, frontmatter: data as ProjectFrontmatter, content };
}

export function getProjects(locale: Locale): Project[] {
  return getProjectSlugs()
    .map((slug) => {
      const project = getProject(locale, slug);
      if (!project) throw new Error(`content/projects/${locale}/${slug}.mdx is missing`);
      return project;
    })
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
