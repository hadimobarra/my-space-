"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Link2, Linkedin } from "lucide-react";
import { SiX } from "react-icons/si";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/avatar";
import { Footer } from "@/components/sections/footer";
import { PostCover } from "./post-cover";
import { PostCard } from "./post-card";
import { TableOfContents } from "./table-of-contents";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/seo";
import type { Heading, PostMeta } from "@/lib/mdx";

interface BlogPostContentProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  htmlContent: string;
  headings: Heading[];
  prev: PostMeta | null;
  next: PostMeta | null;
  related: PostMeta[];
}

const COPY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const CHECK_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

/** Adds a language label and a copy button to every rendered code block. */
function useEnhanceCodeBlocks(ref: React.RefObject<HTMLDivElement | null>, copyLabel: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];

    root.querySelectorAll("pre").forEach((pre) => {
      if (pre.dataset.enhanced) return;
      pre.dataset.enhanced = "true";
      const code = pre.querySelector("code");
      const lang = code?.className.match(/language-([\w-]+)/)?.[1];

      // Wrap the <pre> so the label and button stay pinned while code scrolls horizontally
      const wrapper = document.createElement("div");
      wrapper.className = "code-block relative";
      pre.replaceWith(wrapper);
      wrapper.appendChild(pre);

      if (lang) {
        const label = document.createElement("span");
        label.className = "code-lang";
        label.textContent = lang;
        wrapper.appendChild(label);
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", copyLabel);
      btn.className =
        "absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-[#8b949e] hover:text-white hover:bg-white/10 transition-colors";
      btn.innerHTML = COPY_ICON;
      let timer: number | undefined;
      const onClick = async () => {
        try {
          await navigator.clipboard.writeText(code?.innerText ?? pre.innerText);
          btn.innerHTML = CHECK_ICON;
          btn.classList.add("text-emerald-400");
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove("text-emerald-400");
          }, 1800);
        } catch {
          /* clipboard unavailable */
        }
      };
      btn.addEventListener("click", onClick);
      wrapper.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        window.clearTimeout(timer);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref, copyLabel]);
}

/**
 * The rendered MDX body. Memoised with a stable `__html` object so parent
 * re-renders (theme, locale) never re-apply innerHTML and wipe the
 * enhancements added to the code blocks.
 */
const ArticleBody = memo(function ArticleBody({ html, copyLabel }: { html: string; copyLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => ({ __html: html }), [html]);
  useEnhanceCodeBlocks(ref, copyLabel);
  return <div ref={ref} className="prose-article" dangerouslySetInnerHTML={markup} />;
});

export function BlogPostContent({
  slug,
  title,
  description,
  date,
  readingTime,
  tags,
  htmlContent,
  headings,
  prev,
  next,
  related,
}: BlogPostContentProps) {
  const { t, i18n } = useTranslation();

  const url = `${siteConfig.url}/blog/${slug}/`;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("blog.linkCopied"));
    } catch {
      /* ignore */
    }
  };

  const shareButtons = (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        aria-label={t("blog.copyLink")}
        className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
      >
        <Link2 size={15} />
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
      >
        <SiX size={13} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
      >
        <Linkedin size={15} />
      </a>
    </div>
  );

  return (
    <>
      <div className="relative pt-28 pb-16 section-padding">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[32rem] -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
          <div className="absolute -top-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="container-wide">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
              {t("blog.backToBlog")}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mb-10"
          >
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">{title}</h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-8">{description}</p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar src="/images/profile.jpeg" imageClassName="scale-[1.34]" alt={siteConfig.author} size="md" />
                <div>
                  <p className="text-sm font-semibold">{siteConfig.author}</p>
                  <p className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(date, i18n.language)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {readingTime} {t("blog.minRead")}</span>
                  </p>
                </div>
              </div>
              {shareButtons}
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <PostCover slug={slug} label={tags[0] ?? "Post"} large className="h-48 md:h-72 rounded-3xl mb-14 shadow-2xl shadow-primary/10" />
          </motion.div>

          {/* Body + TOC */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-12 xl:gap-20">
            <article className="min-w-0 max-w-3xl">
              <ArticleBody html={htmlContent} copyLabel={t("blog.copyCode")} />

              {/* Footer of the article */}
              <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
                {shareButtons}
              </div>

              {/* Author card */}
              <div className="mt-10 glass-card border-beam rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
                <Avatar src="/images/profile.jpeg" imageClassName="scale-[1.34]" alt={siteConfig.author} size="lg" className="shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted mb-1">{t("blog.writtenBy")}</p>
                  <p className="text-lg font-semibold mb-2">{siteConfig.author}</p>
                  <p className="text-sm text-muted leading-relaxed mb-4">{t("blog.authorBio")}</p>
                  <Link href="/#contact" className="text-sm font-medium text-primary hover:underline">
                    {t("blog.getInTouch")} →
                  </Link>
                </div>
              </div>

              {/* Prev / next */}
              {(prev || next) && (
                <nav className="mt-10 grid sm:grid-cols-2 gap-4">
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="group glass-card rounded-2xl p-5 hover:border-primary/40 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 text-xs text-muted mb-2">
                        <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
                        {t("blog.previousPost")}
                      </span>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {prev.frontmatter.title}
                      </span>
                    </Link>
                  ) : <span />}
                  {next && (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="group glass-card rounded-2xl p-5 text-end hover:border-primary/40 transition-colors"
                    >
                      <span className="flex items-center justify-end gap-1.5 text-xs text-muted mb-2">
                        {t("blog.nextPost")}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                      </span>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {next.frontmatter.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-24">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">{t("blog.relatedPosts")}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
