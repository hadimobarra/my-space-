import { BookOpen, Rss } from "lucide-react";
import { BlogFilter } from "@/components/blog/blog-filter";
import { PostCard } from "@/components/blog/post-card";
import { PageHeader } from "@/components/shared/page-header";
import { getDictionary } from "@/lib/dictionary";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import { getAllPostMeta } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export function blogIndexMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/blog/", title: t.blog.title, description: t.seo.blogDescription });
}

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = getAllPostMeta();
  const featured = posts.find((p) => p.frontmatter.featured) ?? posts[0];
  const minutes = posts.reduce((sum, p) => sum + p.readingTime, 0);

  const counts = new Map<string, number>();
  posts.forEach((p) => p.frontmatter.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  const tags = [...counts].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <BookOpen size={13} className="text-primary" aria-hidden />
            {formatNumber(posts.length, locale)} {t.blog.articles} · {formatNumber(minutes, locale)} {t.blog.minRead}
          </>
        }
        title={t.blog.pageTitle}
        subtitle={`${t.blog.description} ${t.blog.langNote}`.trim()}
      />
      <div className="pb-24 section-padding">
        <div className="container-wide">
          <BlogFilter
            tags={tags}
            featured={{ slug: featured.slug, card: <PostCard post={featured} locale={locale} t={t} featured headingLevel="h2" /> }}
            items={posts.map((post) => ({
              slug: post.slug,
              tags: post.frontmatter.tags,
              search: [post.frontmatter.title, post.frontmatter.description, ...post.frontmatter.tags].join(" ").toLowerCase(),
              card: <PostCard post={post} locale={locale} t={t} headingLevel="h2" />,
            }))}
            labels={{
              searchPlaceholder: t.blog.searchPlaceholder,
              clearSearch: t.blog.clearSearch,
              allTopics: t.blog.allTopics,
              noResults: t.blog.noResults,
              clearFilters: t.blog.clearFilters,
              resultsCount: t.blog.resultsCount,
            }}
          />
          <div className="mt-16 flex justify-center">
            <a href="/rss.xml" data-track="rss" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-medium text-muted hover:text-primary hover:border-primary/30 transition-colors">
              <Rss size={13} /> {t.blog.subscribe}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
