"use client";

import { GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Timeline, TimelineItem } from "@/components/shared/timeline";

export function Education() {
  const { t } = useTranslation();
  const items = t("education.items", { returnObjects: true }) as {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];

  return (
    <SectionWrapper id="education" title={t("education.title")} subtitle={t("education.subtitle")}>
      <Timeline>
        {items.map((item, i) => (
          <TimelineItem key={i} icon={GraduationCap}>
            <SpotlightCard className="p-6 md:p-8">
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                {item.period}
              </span>
              <h3 className="text-xl font-semibold mb-1">{item.degree}</h3>
              <p className="text-sm font-medium text-foreground/70 mb-3">{item.institution}</p>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </SpotlightCard>
          </TimelineItem>
        ))}
      </Timeline>
    </SectionWrapper>
  );
}
