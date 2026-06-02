"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Star, GitFork } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

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
    <SectionWrapper
      id="open-source"
      title={t("openSource.title")}
      subtitle={t("openSource.subtitle")}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function RepoCard({ repo, index }: { repo: OpenSourceItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block glass-card rounded-2xl p-6 group hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
            {repo.name}
          </h3>
          <ExternalLink size={16} className="text-muted group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </div>
        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
          {repo.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: repo.languageColor || "var(--color-muted)" }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star size={12} />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} />
            {repo.forks}
          </span>
        </div>
      </a>
    </AnimatedElement>
  );
}
