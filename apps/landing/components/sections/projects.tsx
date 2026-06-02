"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import { Badge } from "@/components/ui/badge";

type ProjectTag = "React" | "Next.js" | "TypeScript" | "Node.js" | "Python" | "Tailwind CSS";

interface Project {
  title: string;
  description: string;
  tags: ProjectTag[];
  liveUrl?: string;
  githubUrl?: string;
}

export function Projects() {
  const { t } = useTranslation();
  const items = t("projects.items", { returnObjects: true }) as {
    title: string;
    description: string;
    tags: ProjectTag[];
    liveUrl?: string;
    githubUrl?: string;
  }[];

  return (
    <SectionWrapper
      id="projects"
      title={t("projects.title")}
      subtitle={t("projects.subtitle")}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col group hover:shadow-lg transition-all">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={14} />
              Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              <Github size={14} />
              Source
            </a>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
}
