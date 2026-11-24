import { getAllPostMeta, type PostMeta } from "./mdx";

export interface Topic {
  tag: string;
  slug: string;
  description: string;
  posts: PostMeta[];
}

const descriptions: Record<string, string> = {
  JavaScript: "How the language and its runtime behave: the event loop, proxies, streams, workers and memory.",
  Performance: "Measuring and improving how fast pages load and respond, with numbers rather than checklists.",
  "Browser Internals": "What the browser does with your code: scheduling, rendering, canvas and capture.",
  React: "Structure, rendering and data handling in React applications that keep growing.",
  "Next.js": "Server components, static export and what shipping a Next.js site teaches you.",
  Architecture: "Boundaries, state and reactivity: decisions that are cheap early and expensive later.",
  TypeScript: "Types as a design tool, from runtime validation to type-level programming.",
  "Core Web Vitals": "LCP, INP and CLS in practice: what moves them and what doesn't.",
  "Open Source": "Fixes I have contributed to large projects, and what review taught me.",
  "Data Platforms": "Interfaces for data catalogs, pipelines and large files.",
  "RTL & i18n": "Right-to-left layout, mixed-direction text and localizing generated interfaces.",
  Debugging: "Finding root causes: memory, rendering and engine-specific bugs.",
  CSS: "Layout, rendering cost and direction-aware styling.",
};

export const topicSlug = (tag: string) => tag.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Tags with at least two articles get a page; a page for a single article would add nothing. */
export function getTopics(): Topic[] {
  const byTag = new Map<string, PostMeta[]>();
  for (const post of getAllPostMeta()) {
    for (const tag of post.frontmatter.tags) byTag.set(tag, [...(byTag.get(tag) ?? []), post]);
  }
  return [...byTag]
    .filter(([, posts]) => posts.length >= 2)
    .sort(([a, x], [b, y]) => y.length - x.length || a.localeCompare(b))
    .map(([tag, posts]) => ({ tag, slug: topicSlug(tag), description: descriptions[tag] ?? `Articles about ${tag}.`, posts }));
}

export function getTopic(slug: string) {
  return getTopics().find((topic) => topic.slug === slug);
}
