"use client";

import { Code, Briefcase, Award, GitCommit, MapPin, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement, StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export function About() {
  const { t } = useTranslation();

  const stats = [
    { icon: Code, value: "10+", label: t("about.stats.projects"), tint: "from-primary/15 to-primary/5 text-primary" },
    { icon: Briefcase, value: "30+", label: t("about.stats.technologies"), tint: "from-violet/15 to-violet/5 text-violet" },
    { icon: Award, value: "4+", label: t("about.stats.experience"), tint: "from-secondary/15 to-secondary/5 text-secondary" },
    { icon: GitCommit, value: "1K+", label: t("about.stats.contributions"), tint: "from-accent/15 to-accent/5 text-accent" },
  ];

  return (
    <SectionWrapper id="about" title={t("about.title")} subtitle={t("about.subtitle")}>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <AnimatedElement direction="right">
          <div className="relative">
            <div aria-hidden className="absolute -inset-x-2 sm:-inset-x-6 -inset-y-8 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-violet/5 -z-10" />
            <div className="space-y-5 [&_strong]:text-foreground [&_strong]:font-semibold">
              {["para1", "para2", "para3"].map((k) => (
                <p
                  key={k}
                  className="text-base md:text-lg text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t(`about.${k}`) }}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-xs font-medium">
                <GraduationCap size={14} className="text-primary" /> M.Sc. Computer Engineering
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-xs font-medium">
                <MapPin size={14} className="text-primary" /> {t("contact.locationValue")}
              </span>
            </div>
          </div>
        </AnimatedElement>

        <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <SpotlightCard tilt className="p-6 h-full">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.tint} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <AnimatedCounter value={stat.value} className="text-4xl font-bold tracking-tight gradient-text block" />
                <span className="text-sm text-muted mt-1.5 block">{stat.label}</span>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionWrapper>
  );
}
