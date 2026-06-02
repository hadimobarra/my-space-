"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiGraphql,
  SiGit,
} from "react-icons/si";

interface TechGroup {
  title: string;
  items: { name: string; icon: string }[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiPython, SiDocker, SiPostgresql, SiMongodb, SiPrisma, SiGraphql, SiGit,
};

export function TechStack() {
  const { t } = useTranslation();
  const groups = t("techStack.groups", { returnObjects: true }) as TechGroup[];

  return (
    <SectionWrapper
      id="tech-stack"
      title={t("techStack.title")}
      subtitle={t("techStack.subtitle")}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((group, i) => (
          <TechGroupCard key={group.title} group={group} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function TechGroupCard({ group, index }: { group: TechGroup; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 h-full">
        <h3 className="text-base font-semibold mb-5 pb-3 border-b border-border">
          {group.title}
        </h3>
        <div className="flex flex-wrap gap-3">
          {group.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-alt hover:bg-surface transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedElement>
  );
}
