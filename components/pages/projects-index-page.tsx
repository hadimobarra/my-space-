import { Briefcase } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { PageHeader } from "@/components/shared/page-header";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/locale";
import { getProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export function projectsIndexMetadata(locale: Locale) {
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/projects/", title: t.projects.pageTitle, description: t.seo.projectsDescription });
}

export function ProjectsIndexPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={<><Briefcase size={13} className="text-primary" aria-hidden /> {t.eyebrows.projects}</>}
        title={t.projects.pageTitle}
        subtitle={t.projects.pageSubtitle}
      />
      <div className="pb-24 section-padding">
        <div className="container-wide grid md:grid-cols-2 gap-6">
          {getProjects(locale).map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} t={t} headingLevel="h2" />
          ))}
        </div>
      </div>
    </>
  );
}
