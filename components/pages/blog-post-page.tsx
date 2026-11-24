import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Link2, Linkedin } from "lucide-react";
import { SiX } from "react-icons/si";
import { CodeCopy } from "@/components/blog/code-copy";
import { PostCard } from "@/components/blog/post-card";
import { PostCover } from "@/components/blog/post-cover";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Avatar } from "@/components/shared/avatar";
import { CopyButton } from "@/components/shared/copy-button";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { extractHeadings, getAdjacentPosts, getPostBySlug, getRelatedPosts, renderMdxToHtml } from "@/lib/mdx";
import { absoluteUrl, pageMetadata, siteConfig } from "@/lib/seo";

export function blogPostMetadata(slug: string) {
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { title, description, date, tags } = post.frontmatter;
  return pageMetadata({
    locale: "en",
    path: `/blog/${slug}/`,
    title,
    description,
    image: `/og/blog/${slug}.png`,
    translated: false,
    article: { publishedTime: date, tags },
  });
}

const shareClass =
  "w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors";

export async function BlogPostPage({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const t = getDictionary("en");
  const { title, description, date, tags } = post.frontmatter;
  const url = absoluteUrl(`/blog/${slug}/`);
  const html = await renderMdxToHtml(post.content, t.blog.copyCode);
  const headings = extractHeadings(html);
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    inLanguage: "en",
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

  return (
    <div className="relative pt-28 pb-16 section-padding">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[32rem] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
        <div className="absolute -top-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container-wide">
        <Link href="/blog/" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          {t.blog.backToBlog}
        </Link>

        <header className="max-w-3xl mb-10">
          <ul className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <li key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-dark dark:text-primary">{tag}</li>
            ))}
          </ul>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">{title}</h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed mb-8">{description}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar alt="" className="h-10 w-10" />
              <div>
                <p className="text-sm font-semibold">{siteConfig.author}</p>
                <p className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Calendar size={12} aria-hidden /> <time dateTime={date}>{formatDate(date)}</time></span>
                  <span className="flex items-center gap-1"><Clock size={12} aria-hidden /> {post.readingTime} {t.blog.minRead}</span>
                </p>
              </div>
            </div>
            {share}
          </div>
        </header>

        <PostCover slug={slug} label={tags[0] ?? "Post"} large className="h-48 md:h-72 rounded-3xl mb-14 shadow-2xl shadow-primary/10" />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-12 xl:gap-20">
          <article className="min-w-0 max-w-3xl">
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
            <CodeCopy copiedLabel={t.blog.codeCopied} />

            <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <p className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted">#{tag}</span>
                ))}
              </p>
              {share}
            </div>

            <div className="mt-10 glass-card rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
              <Avatar alt="" className="h-14 w-14 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted mb-1">{t.blog.writtenBy}</p>
                <p className="text-lg font-semibold mb-2">{siteConfig.author}</p>
                <p className="text-sm text-muted leading-relaxed mb-4">{t.blog.authorBio}</p>
                <Link href="/#contact" className="text-sm font-medium text-primary underline underline-offset-4">{t.blog.getInTouch}</Link>
              </div>
            </div>

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
            <div className="sticky top-28"><TableOfContents headings={headings} label={t.blog.onThisPage} /></div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-24 print:hidden">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{t.blog.relatedPosts}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <PostCard key={p.slug} post={p} locale="en" t={t} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
