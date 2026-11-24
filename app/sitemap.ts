import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";
import { getProjectSlugs } from "@/lib/projects";
import { locales, localePath } from "@/lib/locale";
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
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}/`),
      lastModified: new Date(post.frontmatter.date),
      priority: 0.6,
    })),
  ];
}
