"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const gradients = [
  "from-blue-500/80 via-indigo-500/70 to-violet-500/70",
  "from-cyan-500/80 via-sky-500/70 to-blue-500/70",
  "from-emerald-500/80 via-teal-500/70 to-cyan-500/70",
  "from-violet-500/80 via-fuchsia-500/70 to-pink-500/70",
  "from-amber-500/80 via-orange-500/70 to-rose-500/70",
  "from-indigo-500/80 via-blue-500/70 to-emerald-500/70",
];

export function Projects() {
  const { t } = useTranslation();
  const items = t("projects.items", { returnObjects: true }) as Project[];

  return (
    <SectionWrapper id="projects" title={t("projects.title")} subtitle={t("projects.subtitle")}>
      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
        {items.map((project, i) => (
          <StaggerItem key={project.title} className="h-full">
            <ProjectCard project={project} index={i} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useTranslation();
  const primaryUrl = project.liveUrl || project.githubUrl;
  return (
    <SpotlightCard tilt className="h-full flex flex-col overflow-hidden group">
      {/* Generated cover */}
      <div className={`relative h-40 bg-gradient-to-br ${gradients[index % gradients.length]} overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
        <span className="absolute top-4 start-5 text-xs font-mono text-white/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 start-5 text-5xl font-black tracking-tighter text-white/90 drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
          {project.title.split(/\s+/).map((w) => w[0]).join("").slice(0, 3)}
        </span>
        {primaryUrl && (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title}`}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/30"
          >
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>

      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface-alt text-muted border border-border/60">
              {tag}
            </span>
          ))}
        </div>
        {(project.liveUrl || project.githubUrl) && (
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              {t("projects.live")}
              <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
            >
              <Github size={14} />
              {t("projects.source")}
            </a>
          )}
        </div>
        )}
      </div>
    </SpotlightCard>
  );
}
