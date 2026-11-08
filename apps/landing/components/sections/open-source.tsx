"use client";

import { ArrowUpRight, Star, GitFork, BookMarked } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

interface OpenSourceItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  language: string;
  languageColor: string;
}

export function OpenSource() {
  const { t } = useTranslation();
  const items = t("openSource.repos", { returnObjects: true }) as OpenSourceItem[];

  return (
    <SectionWrapper id="open-source" title={t("openSource.title")} subtitle={t("openSource.subtitle")} className="bg-surface/60">
      <StaggerContainer className="grid md:grid-cols-2 gap-5" staggerDelay={0.08}>
        {items.map((repo) => (
          <StaggerItem key={repo.name} className="h-full">
            <SpotlightCard
              as="a"
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 h-full group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="flex items-center gap-2 text-base font-semibold font-mono group-hover:text-primary transition-colors">
                  <BookMarked size={16} className="text-muted shrink-0" />
                  {repo.name}
                </h3>
                <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:rotate-45">
                  <ArrowUpRight size={15} />
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-5 text-xs text-muted">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full ring-2 ring-background" style={{ backgroundColor: repo.languageColor || "var(--muted)" }} />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><Star size={13} /> {repo.stars}</span>
                <span className="flex items-center gap-1"><GitFork size={13} /> {repo.forks}</span>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
