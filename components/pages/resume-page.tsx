import Link from "next/link";
import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import { getDictionary } from "@/lib/dictionary";
import { mergedPullRequests } from "@/lib/github";
import { localePath, type Locale } from "@/lib/locale";
import { getProjects } from "@/lib/projects";
import { pageMetadata, siteConfig } from "@/lib/seo";

export function resumeMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/resume/", title: t.resume.title, description: t.seo.resumeDescription });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-block">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function ResumePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { resume } = t;
  const button = "inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold";
  const { email, github, linkedin } = siteConfig.links;

  return (
    <div className="pt-28 pb-24 section-padding print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-8 print:hidden">
          <a href="/resume.pdf" download="Hadi-Mobarra-Resume.pdf" data-track="resume-download" className={`${button} btn-gradient`}>
            <Download size={16} />
            {resume.download}
          </a>
          <PrintButton label={resume.print} className={`${button} border border-border bg-card hover:border-primary/40 transition-colors`} />
        </div>

        <div className="resume-sheet glass-card rounded-3xl p-7 md:p-12 space-y-9">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{t.hero.name}</h1>
            <p className="text-lg text-primary font-medium mb-3">{resume.headline}</p>
            <p className="text-sm text-muted flex flex-wrap gap-x-4 gap-y-1">
              <span>{t.contact.locationValue}</span>
              <a dir="ltr" href={`mailto:${email}`} className="underline underline-offset-2">{email}</a>
              <a dir="ltr" href={github} className="underline underline-offset-2">github.com/hadimobarra</a>
              <a dir="ltr" href={linkedin} className="underline underline-offset-2">linkedin.com/in/hadi-mobarra</a>
            </p>
          </header>

          <Block title={resume.summaryTitle}>
            <p className="text-sm leading-relaxed">{resume.summary}</p>
          </Block>

          <Block title={resume.skills}>
            <dl className="grid sm:grid-cols-[11rem_1fr] gap-x-4 gap-y-2 text-sm">
              {t.skills.groups.map((group) => (
                <div key={group.title} className="contents">
                  <dt className="font-semibold">{group.title}</dt>
                  <dd className="text-muted">{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block title={resume.experience}>
            <div className="space-y-7">
              {t.experience.items.map((job) => (
                <article key={job.company}>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <h3 className="font-semibold">{job.title} · {job.company}</h3>
                    <p className="text-sm text-muted">{job.period}</p>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed list-disc ps-5 marker:text-primary">
                    {job.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                  <p className="mt-3 text-xs text-muted"><strong>{resume.stack}:</strong> {job.tags.join(", ")}</p>
                </article>
              ))}
            </div>
          </Block>

          <Block title={resume.openSource}>
            <h3 className="text-sm font-semibold mb-2">{resume.mergedPrs}</h3>
            <ul className="space-y-1.5 text-sm list-disc ps-5 marker:text-primary mb-5">
              {mergedPullRequests.map((pr) => (
                <li key={pr.url}>
                  <a href={pr.url} dir="ltr" lang="en" className="underline underline-offset-2 hover:text-primary">
                    {pr.repo} #{pr.number}: {pr.title}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold mb-2">{resume.caseStudies}</h3>
            <ul className="space-y-1.5 text-sm list-disc ps-5 marker:text-primary">
              {getProjects(locale).map((p) => (
                <li key={p.slug}>
                  <Link href={localePath(locale, `/projects/${p.slug}/`)} className="underline underline-offset-2 hover:text-primary">{p.frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </Block>

          <Block title={resume.education}>
            <div className="space-y-3 text-sm">
              {t.education.items.map((item) => (
                <div key={item.degree} className="flex flex-wrap justify-between gap-x-4">
                  <p><strong>{item.degree}</strong> · {item.institution}</p>
                  <p className="text-muted">{item.period}</p>
                </div>
              ))}
              <p><strong>{resume.honors}:</strong> {resume.honorsValue}</p>
            </div>
          </Block>
        </div>
      </div>
    </div>
  );
}
