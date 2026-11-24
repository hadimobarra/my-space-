import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import { getProjects } from "@/lib/projects";

export function Projects({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <SectionWrapper id="projects" eyebrow={t.eyebrows.projects} title={t.projects.title} subtitle={t.projects.subtitle}>
      <div className="grid md:grid-cols-2 gap-6">
        {getProjects(locale).slice(0, 4).map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} t={t} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href={localePath(locale, "/projects/")}
          className="group inline-flex items-center gap-2 h-12 px-7 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
        >
          {t.projects.viewAll}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
