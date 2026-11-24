import Link from "next/link";
import { Route, Tag } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { PageHeader } from "@/components/shared/page-header";
import { getDictionary } from "@/lib/dictionary";
import { fill } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { getSeries } from "@/lib/series";
import { getTopic, getTopics } from "@/lib/topics";

// Topic and learning-path pages list English articles, so they exist in English only.
const t = getDictionary("en");

export const topicsIndexMetadata = pageMetadata({
  locale: "en",
  path: "/blog/topics/",
  title: t.blog.topics,
  description: "Every topic on the blog: JavaScript, performance, React, data platforms, open source and more.",
  translated: false,
});

export function TopicsIndexPage() {
  return (
    <>
      <PageHeader eyebrow={<><Tag size={13} className="text-primary" aria-hidden /> {t.blog.title}</>} title={t.blog.topics} subtitle={t.blog.topicsSubtitle} />
      <div className="pb-24 section-padding">
        <ul className="container-wide grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {getTopics().map((topic) => (
            <li key={topic.slug}>
              <Link href={`/blog/topics/${topic.slug}/`} className="group block h-full glass-card rounded-2xl p-6 hover:border-primary/40 transition-colors">
                <span className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-lg font-semibold group-hover:text-primary transition-colors">{topic.tag}</span>
                  <span className="text-xs text-muted">{fill(t.blog.allArticlesIn, { count: topic.posts.length })}</span>
                </span>
                <span className="block text-sm text-muted leading-relaxed">{topic.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function topicMetadata(slug: string) {
  const topic = getTopic(slug);
  return topic ? pageMetadata({ locale: "en", path: `/blog/topics/${slug}/`, title: `${topic.tag} articles`, description: topic.description, translated: false }) : {};
}

export function TopicPage({ slug }: { slug: string }) {
  const topic = getTopic(slug);
  if (!topic) return null;
  return (
    <>
      <PageHeader eyebrow={<><Tag size={13} className="text-primary" aria-hidden /> <Link href="/blog/topics/" className="underline underline-offset-2">{t.blog.topics}</Link></>} title={topic.tag} subtitle={topic.description} />
      <div className="pb-24 section-padding">
        <div className="container-wide grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.posts.map((post) => <PostCard key={post.slug} post={post} locale="en" t={t} headingLevel="h2" />)}
        </div>
      </div>
    </>
  );
}

export function seriesMetadata(slug: string) {
  const series = getSeries(slug);
  return series ? pageMetadata({ locale: "en", path: `/blog/series/${slug}/`, title: series.title, description: series.description, translated: false }) : {};
}

export function SeriesPage({ slug }: { slug: string }) {
  const series = getSeries(slug);
  if (!series) return null;
  return (
    <>
      <PageHeader
        eyebrow={<><Route size={13} className="text-primary" aria-hidden /> {t.blog.series} · {fill(t.blog.allArticlesIn, { count: series.posts.length })}</>}
        title={series.title}
        subtitle={series.description}
      />
      <div className="pb-24 section-padding">
        <ol className="max-w-3xl mx-auto space-y-4">
          {series.posts.map((post, i) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`} className="group flex gap-5 glass-card rounded-2xl p-6 hover:border-primary/40 transition-colors">
                <span aria-hidden className="text-2xl font-bold font-mono text-primary">{i + 1}</span>
                <span>
                  <span className="block text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{post.frontmatter.title}</span>
                  <span className="block text-sm text-muted leading-relaxed">{post.frontmatter.description}</span>
                  <span className="block text-xs text-muted mt-2">{post.readingTime} {t.blog.minRead}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
