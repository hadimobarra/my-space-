import Link from "next/link";
import { BookOpen, Route } from "lucide-react";
import { BlogFilter } from "@/components/blog/blog-filter";
import { PostCard } from "@/components/blog/post-card";
import { Subscribe } from "@/components/blog/subscribe";
import { PageHeader } from "@/components/shared/page-header";
import { getDictionary } from "@/lib/dictionary";
import { formatNumber } from "@/lib/format";
import { fill, localePath, type Locale } from "@/lib/locale";
import { getPostListing } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";
import { getAllSeries } from "@/lib/series";
import { getTopics } from "@/lib/topics";

export function blogIndexMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/blog/", title: t.blog.title, description: t.seo.blogDescription });
}

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = getPostListing(locale);
  const featured = posts.find((p) => p.frontmatter.featured) ?? posts[0];
  const minutes = posts.reduce((sum, p) => sum + p.readingTime, 0);

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
            tags={getTopics().map((topic) => topic.tag)}
            featured={{ slug: featured.slug, card: <PostCard post={featured} locale={locale} t={t} featured headingLevel="h2" /> }}
            items={posts.map((post) => ({
              slug: post.slug,
              href: localePath(post.locale, `/blog/${post.slug}/`),
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

          {locale === "en" && (
            <section aria-labelledby="paths" className="mt-24">
              <h2 id="paths" className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.blog.allSeries}</h2>
              <p className="text-muted mb-8">
                {t.blog.seriesSubtitle} <Link href="/blog/topics/" className="text-primary underline underline-offset-4">{t.blog.topics}</Link>
              </p>
              <ul className="grid sm:grid-cols-2 gap-5">
                {getAllSeries().map((series) => (
                  <li key={series.slug}>
                    <Link href={`/blog/series/${series.slug}/`} className="group block h-full glass-card rounded-2xl p-6 hover:border-primary/40 transition-colors">
                      <span className="flex items-center gap-2 text-xs text-muted mb-2">
                        <Route size={14} className="text-primary" aria-hidden /> {fill(t.blog.allArticlesIn, { count: series.posts.length })}
                      </span>
                      <span className="block text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">{series.title}</span>
                      <span className="block text-sm text-muted leading-relaxed">{series.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Subscribe locale={locale} t={t} />
        </div>
      </div>
    </>
  );
}
