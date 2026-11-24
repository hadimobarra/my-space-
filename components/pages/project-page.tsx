import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { CodeCopy } from "@/components/blog/code-copy";
import { PostCover } from "@/components/blog/post-cover";
import { UploadDemo } from "@/components/projects/upload-demo";
import { Tag } from "@/components/shared/tag";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import { renderMdxToHtml } from "@/lib/mdx";
import { getProject, getProjects } from "@/lib/projects";
import { absoluteUrl, pageMetadata, siteConfig } from "@/lib/seo";

export function projectMetadata(locale: Locale, slug: string) {
  const project = getProject(locale, slug);
  if (!project) return {};
  const { title, summary } = project.frontmatter;
  return pageMetadata({ locale, path: `/projects/${slug}/`, title, description: summary, image: `/og/projects/${slug}.png` });
}

export async function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProject(locale, slug);
  if (!project) return null;

  const t = getDictionary(locale);
  const { title, summary, role, context, status, cover, tags, links = [], confidential, demo } = project.frontmatter;
  const html = await renderMdxToHtml(project.content, t.blog.copyCode);

  const all = getProjects(locale);
  const next = all[(all.findIndex((p) => p.slug === slug) + 1) % all.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: summary,
    inLanguage: locale,
    image: absoluteUrl(`/og/projects/${slug}.png`),
    author: { "@id": `${siteConfig.url}/#person` },
    url: absoluteUrl(localePath(locale, `/projects/${slug}/`)),
  };

  const facts = [
    [t.projects.role, role],
    [t.projects.context, context],
    [t.projects.status, status],
  ];

  return (
    <div className="relative pt-28 pb-24 section-padding">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[32rem] -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-radial opacity-50" />
        <div className="absolute -top-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container-wide">
        <Link href={localePath(locale, "/projects/")} className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t.projects.back}
        </Link>

        <header className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">{t.eyebrows["case-study"]}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-5">{title}</h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed">{summary}</p>
        </header>

        <PostCover slug={slug} label={cover} large className="h-40 md:h-56 rounded-3xl mb-14 shadow-2xl shadow-primary/10" />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-12 xl:gap-20">
          <aside className="lg:order-2">
            <div className="lg:sticky lg:top-28 space-y-6 text-sm">
              <dl className="grid sm:grid-cols-3 lg:grid-cols-1 gap-5">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{t.projects.stack}</p>
                <div className="flex flex-wrap gap-1.5">{tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
              </div>
              {(links.length > 0 || demo) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{t.projects.links}</p>
                  <ul className="space-y-2">
                    {demo && (
                      <li><a href="#demo" className="font-medium text-primary underline underline-offset-4">{t.projects.liveDemo}</a></li>
                    )}
                    {links.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} data-track={`case-link-${slug}`} className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4">
                          <bdi>{link.label}</bdi> <ArrowUpRight size={14} aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {confidential && (
                <p className="flex gap-2.5 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted">
                  <Lock size={14} aria-hidden className="shrink-0 mt-0.5" /> {t.projects.confidential}
                </p>
              )}
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl lg:order-1">
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
            <CodeCopy copiedLabel={t.blog.codeCopied} />
            {demo === "upload" && <UploadDemo locale={locale} labels={t.uploadDemo} />}

            <Link href={localePath(locale, `/projects/${next.slug}/`)} className="group mt-16 flex items-center justify-between gap-6 glass-card rounded-2xl p-6 hover:border-primary/40 transition-colors print:hidden">
              <span>
                <span className="block text-xs text-muted mb-1">{t.projects.nextCase}</span>
                <span className="block font-semibold group-hover:text-primary transition-colors">{next.frontmatter.title}</span>
              </span>
              <ArrowRight size={18} aria-hidden className="shrink-0 text-muted rtl:rotate-180" />
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}
