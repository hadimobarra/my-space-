import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, History, Link2, Linkedin, Pencil } from "lucide-react";
import { SiX } from "react-icons/si";
import { ArticleBody } from "@/components/blog/article-body";
import { CodeCopy } from "@/components/blog/code-copy";
import { Comments } from "@/components/blog/comments";
import { PostCard } from "@/components/blog/post-card";
import { PostCover } from "@/components/blog/post-cover";
import { SeriesNav } from "@/components/blog/series-nav";
import { Subscribe } from "@/components/blog/subscribe";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Avatar } from "@/components/shared/avatar";
import { CopyButton } from "@/components/shared/copy-button";
import { getDictionary } from "@/lib/dictionary";
import { formatDate, formatNumber } from "@/lib/format";
import { localePath, type Locale } from "@/lib/locale";
import { extractHeadings, getAdjacentPosts, getAllPostSlugs, getPostBySlug, getPostListing, getRelatedPosts, postSourcePath, renderMdxToHtml } from "@/lib/mdx";
import { absoluteUrl, pageMetadata, siteConfig } from "@/lib/seo";
import { getSeriesOf } from "@/lib/series";
import { getTopics } from "@/lib/topics";

const isTranslated = (slug: string) => getAllPostSlugs("fa").includes(slug);

export function blogPostMetadata(locale: Locale, slug: string) {
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  const { title, description, date, updated, tags } = post.frontmatter;
  return pageMetadata({
    locale,
    path: `/blog/${slug}/`,
    title,
    description,
    image: `/og/blog/${slug}.png`,
    translated: isTranslated(slug),
    article: { publishedTime: date, modifiedTime: updated, tags },
  });
}

const shareClass =
  "w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors";
const tagClass = "px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-dark dark:text-primary";

export async function BlogPostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const post = getPostBySlug(slug, locale);
  if (!post) return null;

  const t = getDictionary(locale);
  const { title, description, date, updated, tags } = post.frontmatter;
  const path = localePath(locale, `/blog/${slug}/`);
  const url = absoluteUrl(path);
  const blogHome = localePath(locale, "/blog/");
  const html = await renderMdxToHtml(post.content, t.blog.copyCode);
  const headings = extractHeadings(html);
  const series = locale === "en" ? getSeriesOf(slug) : undefined;
  const { prev, next } = locale === "en" ? getAdjacentPosts(slug) : { prev: null, next: null };
  const related = locale === "en" ? getRelatedPosts(slug) : getPostListing("fa").filter((p) => p.slug !== slug).slice(0, 3);
  // Topic pages are in English only
  const topics = new Map(locale === "en" ? getTopics().map((topic) => [topic.tag, `/blog/topics/${topic.slug}/`]) : []);
  const showUpdated = updated && updated !== date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: updated ?? date,
    inLanguage: locale,
    image: absoluteUrl(`/og/blog/${slug}.png`),
    keywords: tags.join(", "),
    author: { "@id": `${siteConfig.url}/#person` },
    mainEntityOfPage: url,
    url,
  };

  const share = (
    <div className="flex items-center gap-2 print:hidden">
      <CopyButton value={url} label={t.blog.copyLink} copiedLabel={t.blog.linkCopied} className={shareClass}>
        <Link2 size={15} />
      </CopyButton>
      <a href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} rel="noopener noreferrer" aria-label={t.blog.shareX} data-track="share-x" className={shareClass}>
        <SiX size={13} role="presentation" aria-hidden />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} rel="noopener noreferrer" aria-label={t.blog.shareLinkedIn} data-track="share-linkedin" className={shareClass}>
        <Linkedin size={15} />
      </a>
    </div>
  );

  const tagList = tags.map((tag) => {
    const href = topics.get(tag);
    return (
      <li key={tag}>
        {href ? <Link href={href} className={`${tagClass} hover:bg-primary/20 transition-colors`}>{tag}</Link> : <span className={tagClass}>{tag}</span>}
      </li>
    );
  });

  return (
    <div className="relative pt-28 pb-16 section-padding">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[32rem] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
        <div className="absolute -top-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container-wide">
        <Link href={blogHome} className="group inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t.blog.backToBlog}
        </Link>

        <header className="max-w-3xl mb-10">
          <ul className="flex flex-wrap gap-2 mb-5">{tagList}</ul>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">{title}</h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-8">{description}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar alt="" className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t.hero.name}</p>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1"><Calendar size={12} aria-hidden /> <time dateTime={date}>{formatDate(date, locale)}</time></span>
                  {showUpdated && (
                    <span className="flex items-center gap-1"><History size={12} aria-hidden /> {t.blog.updated} <time dateTime={updated}>{formatDate(updated, locale)}</time></span>
                  )}
                  <span className="flex items-center gap-1"><Clock size={12} aria-hidden /> {formatNumber(post.readingTime, locale)} {t.blog.minRead}</span>
                </p>
              </div>
            </div>
            {share}
          </div>
          {isTranslated(slug) && (
            <p className="mt-5 text-sm">
              <a href={localePath(locale === "en" ? "fa" : "en", `/blog/${slug}/`)} lang={locale === "en" ? "fa" : "en"} hrefLang={locale === "en" ? "fa" : "en"} className="font-medium text-primary underline underline-offset-4">
                {t.blog.otherLanguage}
              </a>
            </p>
          )}
        </header>

        <PostCover slug={slug} label={tags[0] ?? "Post"} large className="h-40 md:h-56 rounded-3xl mb-12 shadow-2xl shadow-primary/10" />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-12 xl:gap-20">
          <article className="min-w-0 max-w-3xl">
            {series && <SeriesNav series={series} slug={slug} t={t} />}
            <div data-pagefind-body>
              <p hidden data-pagefind-meta="title">{title}</p>
              <ArticleBody html={html} locale={locale} />
            </div>
            <CodeCopy copiedLabel={t.blog.codeCopied} />

            <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <a href={`${siteConfig.links.source}/edit/main/${postSourcePath(slug, locale)}`} data-track="edit-article" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors print:hidden">
                <Pencil size={14} aria-hidden /> {t.blog.editOnGithub}
              </a>
              {share}
            </div>

            <div className="mt-10 glass-card rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
              <Avatar alt="" className="h-14 w-14 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1">{t.blog.writtenBy}</p>
                <p className="text-lg font-semibold mb-2">{t.hero.name}</p>
                <p className="text-sm text-muted leading-relaxed mb-4">{t.blog.authorBio}</p>
                <p className="flex gap-5 text-sm font-medium text-primary">
                  <Link href={localePath(locale, "/hire/")} className="underline underline-offset-4">{t.blog.getInTouch}</Link>
                  <Link href={localePath(locale, "/ai/")} className="underline underline-offset-4">{t.nav.ai}</Link>
                </p>
              </div>
            </div>

            <Comments locale={locale} term={`blog/${slug}`} title={title} labels={{ comments: t.blog.comments, loadComments: t.blog.loadComments, commentsNote: t.blog.commentsNote, discuss: t.blog.discuss }} />

            {(prev || next) && (
              <nav aria-label={t.blog.relatedPosts} className="mt-10 grid sm:grid-cols-2 gap-4 print:hidden">
                {prev ? (
                  <Link href={`/blog/${prev.slug}/`} className="group glass-card rounded-2xl p-5 hover:border-primary/40 transition-colors">
                    <span className="flex items-center gap-1.5 text-xs text-muted mb-2"><ArrowLeft size={13} /> {t.blog.previousPost}</span>
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{prev.frontmatter.title}</span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link href={`/blog/${next.slug}/`} className="group glass-card rounded-2xl p-5 text-end hover:border-primary/40 transition-colors">
                    <span className="flex items-center justify-end gap-1.5 text-xs text-muted mb-2">{t.blog.nextPost} <ArrowRight size={13} /></span>
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{next.frontmatter.title}</span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto"><TableOfContents headings={headings} label={t.blog.onThisPage} /></div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24 print:hidden">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{t.blog.relatedPosts}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <PostCard key={p.slug} post={p} locale={locale} t={t} />)}
            </div>
          </section>
        )}
        <Subscribe locale={locale} t={t} />
      </div>
    </div>
  );
}
