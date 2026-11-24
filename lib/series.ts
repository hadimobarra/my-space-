import { getPostBySlug, type PostMeta } from "./mdx";

export interface Series {
  slug: string;
  title: string;
  description: string;
  posts: PostMeta[];
}

/** Learning paths: articles in reading order. Each article belongs to at most one. */
const definitions: { slug: string; title: string; description: string; posts: string[] }[] = [
  {
    slug: "data-platform-interfaces",
    title: "Building data platform interfaces",
    description: "Exports, uploads, generated forms, untrusted data and right-to-left layout: problems from catalogs, pipelines and BI tools.",
    posts: [
      "safari-blank-chart-exports",
      "resumable-uploads-tus",
      "never-trust-json-parse-in-render",
      "translating-json-schema-forms",
      "rtl-is-not-a-translation-step",
      "persian-in-data-tools",
      "first-pr-in-a-large-project",
    ],
  },
  {
    slug: "browser-internals",
    title: "Browser internals",
    description: "From a single task to a smooth page: scheduling, rendering, responsiveness, workers and memory.",
    posts: [
      "javascript-event-loop-deep-dive",
      "browser-rendering-pipeline-60fps",
      "taming-inp-interaction-to-next-paint",
      "web-workers-off-main-thread",
      "hunting-memory-leaks-javascript",
    ],
  },
  {
    slug: "react-in-production",
    title: "React in production",
    description: "Structure, server components and performance, ending with an honest case study of this site.",
    posts: [
      "react-architecture",
      "react-server-components-mental-model",
      "nextjs-best-practices",
      "frontend-performance",
      "less-javascript-same-blocking-time",
    ],
  },
  {
    slug: "javascript-in-depth",
    title: "JavaScript in depth",
    description: "Reactivity, proxies, streams and the type system, built from first principles.",
    posts: ["proxy-and-reflect-metaprogramming", "build-signals-from-scratch", "async-iterators-generators-streams", "typescript-type-level-programming"],
  },
];

export const seriesSlugs = definitions.map((s) => s.slug);

export function getSeries(slug: string): Series | undefined {
  const definition = definitions.find((s) => s.slug === slug);
  return (
    definition && {
      ...definition,
      posts: definition.posts.map((postSlug) => {
        const post = getPostBySlug(postSlug);
        if (!post) throw new Error(`Series "${slug}" lists a missing article: ${postSlug}`);
        return post;
      }),
    }
  );
}

export function getAllSeries(): Series[] {
  return seriesSlugs.map((slug) => getSeries(slug)!);
}

export function getSeriesOf(postSlug: string): Series | undefined {
  const definition = definitions.find((s) => s.posts.includes(postSlug));
  return definition && getSeries(definition.slug);
}
