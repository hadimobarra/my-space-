import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/dictionary";
import { formatDate } from "@/lib/format";
import { github } from "@/lib/github";
import { localePath, type Locale } from "@/lib/locale";
import { getPostListing } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

/** Bump when the hand-written parts of the page are reviewed. */
const REVIEWED = "2026-11-24";

export function nowMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/now/", title: t.now.title, description: t.seo.nowDescription });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function NowPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const open = github.pullRequests.filter((pr) => pr.state === "open");
  const list = "space-y-2 list-disc ps-5 marker:text-primary";
  const link = "underline underline-offset-4 decoration-border hover:text-primary";

  return (
    <div className="pt-32 pb-24 section-padding">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">{t.now.title}</h1>
        <p className="text-lg text-muted">{t.now.subtitle}</p>
        <p className="text-sm text-muted mt-2 mb-12">{t.now.updated}: <time dateTime={REVIEWED}>{formatDate(REVIEWED, locale)}</time></p>
        <div className="space-y-12 leading-relaxed">
          <Block title={t.now.workTitle}>
            <ul className={list}>{t.now.work.map((item) => <li key={item}>{item}</li>)}</ul>
          </Block>
          <Block title={t.now.reviewTitle}>
            {open.length ? (
              <ul className={list}>
                {open.map((pr) => (
                  <li key={pr.url}><a href={pr.url} lang="en" dir="ltr" className={link}>{pr.repo} #{pr.number}: {pr.title}</a></li>
                ))}
              </ul>
            ) : (
              <p>{t.now.reviewEmpty}</p>
            )}
          </Block>
          <Block title={t.now.writingTitle}>
            <ul className={list}>
              {getPostListing(locale).slice(0, 4).map((post) => {
                const props = { href: localePath(post.locale, `/blog/${post.slug}/`), lang: post.locale, className: link, children: post.frontmatter.title };
                return <li key={post.slug}>{post.locale === locale ? <Link {...props} /> : <a {...props}>{props.children}</a>}</li>;
              })}
            </ul>
          </Block>
          <Block title={t.now.siteTitle}>
            <ul className={list}>{t.now.site.map((item) => <li key={item}>{item}</li>)}</ul>
          </Block>
        </div>
      </div>
    </div>
  );
}
