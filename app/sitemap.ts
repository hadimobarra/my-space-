import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";
import { getProjectSlugs } from "@/lib/projects";
import { locales, localePath } from "@/lib/locale";
import { seriesSlugs } from "@/lib/series";
import { getTopics } from "@/lib/topics";
import { github } from "@/lib/github";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newestPost = new Date(posts[0].frontmatter.date);
  const githubRefresh = new Date(github.fetchedAt);

  const translated = [
    { path: "/", priority: 1, lastModified: githubRefresh > newestPost ? githubRefresh : newestPost },
    { path: "/projects/", priority: 0.9 },
    ...getProjectSlugs().map((slug) => ({ path: `/projects/${slug}/`, priority: 0.8 })),
    { path: "/blog/", priority: 0.8, lastModified: newestPost },
    { path: "/resume/", priority: 0.7 },
    ...["rtl", "hire", "catalog", "notes", "fit", "glossary", "corrections", "ai", "questions", "weeks", "now"].map((p) => ({ path: `/${p}/`, priority: 0.5 })),
  ];

  return [
    ...translated.flatMap(({ path, ...rest }) =>
      locales.map((locale) => ({
        url: absoluteUrl(localePath(locale, path)),
        ...rest,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
        },
      }))
    ),
    ...locales.flatMap((locale) =>
      getAllPosts(locale).map((post) => ({
        url: absoluteUrl(localePath(locale, `/blog/${post.slug}/`)),
        lastModified: new Date(post.frontmatter.updated ?? post.frontmatter.date),
        priority: 0.6,
      }))
    ),
    ...["/blog/topics/", ...getTopics().map((t) => `/blog/topics/${t.slug}/`), ...seriesSlugs.map((s) => `/blog/series/${s}/`)].map((path) => ({
      url: absoluteUrl(path),
      priority: 0.5,
    })),
  ];
}
