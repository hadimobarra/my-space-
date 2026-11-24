import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { PostCover } from "@/components/blog/post-cover";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Tag } from "@/components/shared/tag";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, locale, t, headingLevel: Heading = "h3" }: { project: Project; locale: Locale; t: Dictionary; headingLevel?: "h2" | "h3" }) {
  const { title, summary, cover, tags, status, demo } = project.frontmatter;
  return (
    <SpotlightCard
      as={Link}
      href={localePath(locale, `/projects/${project.slug}/`)}
      data-track={`case-study-${project.slug}`}
      className="reveal group h-full flex flex-col overflow-hidden"
    >
      <PostCover slug={project.slug} label={cover} className="h-36" />
      <div className="flex-1 flex flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs text-muted">
          <span>{status}</span>
          {demo && (
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              <Play size={11} className="fill-current rtl:-scale-x-100" /> {t.projects.liveDemo}
            </span>
          )}
        </div>
        <Heading className="text-xl font-semibold leading-snug mb-3 group-hover:text-primary transition-colors">{title}</Heading>
        <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{summary}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
        <span className="inline-flex items-center gap-1.5 pt-4 border-t border-border text-sm font-semibold text-primary">
          {t.projects.readCase}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </SpotlightCard>
  );
}
