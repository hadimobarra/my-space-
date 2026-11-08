"use client";

import { Award, BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export function Certifications() {
  const { t } = useTranslation();
  const items = t("certifications.items", { returnObjects: true }) as Certification[];

  return (
    <SectionWrapper id="certifications" title={t("certifications.title")} subtitle={t("certifications.subtitle")}>
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
        {items.map((cert) => (
          <StaggerItem key={cert.name} className="h-full">
            <SpotlightCard className="p-5 h-full flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-[15deg]">
                <Award size={19} className="text-amber-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{cert.name}</h3>
                <p className="text-xs text-muted flex items-center gap-1">
                  <BadgeCheck size={12} className="text-accent shrink-0" /> {cert.issuer}
                </p>
                <p className="text-[11px] font-mono text-muted mt-1.5">{cert.date}</p>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
