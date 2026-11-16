"use client";

import { Calendar, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Timeline, TimelineItem } from "@/components/shared/timeline";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export function Experience() {
  const { t } = useTranslation();
  const items = t("experience.items", { returnObjects: true }) as ExperienceItem[];

  return (
    <SectionWrapper
      id="experience"
      title={t("experience.title")}
      subtitle={t("experience.subtitle")}
      className="bg-surface/60"
    >
      <Timeline>
        {items.map((item, i) => (
          <TimelineItem key={`${item.company}-${i}`} icon={Building2} accent="secondary">
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm font-medium text-primary mt-0.5">{item.company}</p>
                </div>
                <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface-alt text-muted border border-border/60">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </SpotlightCard>
          </TimelineItem>
        ))}
      </Timeline>
    </SectionWrapper>
  );
}
