"use client";

import { useTranslation } from "react-i18next";
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiDocker,
  SiPostgresql, SiMongodb, SiPrisma, SiGraphql, SiGit, SiRedux, SiJavascript, SiAntdesign,
  SiMaterialdesign, SiWebpack, SiVite,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

interface TechGroup {
  title: string;
  items: { name: string; icon: string }[];
}

const iconMap: Record<string, IconType> = {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiDocker, SiPostgresql,
  SiMongodb, SiPrisma, SiGraphql, SiGit, SiRedux, SiJavascript, SiAntdesign, SiMaterialdesign, SiWebpack, SiVite,
};

const brandColors: Record<string, string> = {
  SiReact: "#61DAFB", SiTypescript: "#3178C6", SiTailwindcss: "#06B6D4", SiNodedotjs: "#5FA04E",
  SiPython: "#3776AB", SiDocker: "#2496ED", SiPostgresql: "#4169E1", SiMongodb: "#47A248",
  SiPrisma: "#5A67D8", SiGraphql: "#E10098", SiGit: "#F05032", SiRedux: "#764ABC",
  SiJavascript: "#F7DF1E", SiAntdesign: "#0170FE", SiMaterialdesign: "#757FF6", SiWebpack: "#8DD6F9", SiVite: "#646CFF",
};

export function TechStack() {
  const { t } = useTranslation();
  const groups = t("techStack.groups", { returnObjects: true }) as TechGroup[];
  const allItems = Array.from(
    new Map(groups.flatMap((g) => g.items).map((i) => [i.icon, i])).values()
  );

  return (
    <SectionWrapper id="tech-stack" title={t("techStack.title")} subtitle={t("techStack.subtitle")} className="bg-surface/60 overflow-hidden">
      {/* Dual infinite marquee */}
      <div className="relative mb-14 space-y-4 mask-fade-x" dir="ltr">
        {[false, true].map((reverse) => (
          <div key={String(reverse)} className="flex overflow-hidden group">
            <div
              className="flex shrink-0 gap-4 pe-4 animate-marquee group-hover:[animation-play-state:paused]"
              style={{ animationDirection: reverse ? "reverse" : "normal", animationDuration: "40s" }}
            >
              {[...allItems, ...allItems].map((item, i) => {
                const Icon = iconMap[item.icon];
                return (
                  <div
                    key={`${item.icon}-${i}`}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass-card whitespace-nowrap"
                  >
                    {Icon && <Icon size={20} style={{ color: brandColors[item.icon] }} className="dark:brightness-125" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
        {groups.map((group) => (
          <StaggerItem key={group.title} className="h-full">
            <SpotlightCard className="p-6 h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-5">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <div
                      key={item.name}
                      className="group/chip flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt/80 border border-border/60 hover:border-primary/30 transition-colors"
                    >
                      {Icon && (
                        <Icon
                          className="w-4 h-4 transition-transform group-hover/chip:scale-125"
                          style={{ color: brandColors[item.icon] }}
                        />
                      )}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
