"use client";

import { motion } from "framer-motion";
import { MessageSquareCode, Atom, Palette, Wrench, Radio, Cloud, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

// Icons are matched by position so they work for every locale
const categoryIcons: LucideIcon[] = [MessageSquareCode, Atom, Palette, Wrench, Radio, Cloud];

export function Skills() {
  const { t } = useTranslation();
  const skillCategories = t("skillCategories", { returnObjects: true }) as {
    title: string;
    skills: { name: string; level: number }[];
  }[];

  return (
    <SectionWrapper
      id="skills"
      title={t("skills.title")}
      subtitle={t("skills.subtitle")}
      className="bg-surface/60"
    >
      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
        {skillCategories.map((category, i) => {
          const Icon = categoryIcons[i] ?? Package;
          return (
            <StaggerItem key={category.title} className="h-full">
              <SpotlightCard className="p-6 h-full group">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-violet/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <Icon size={18} className="text-primary" />
                  </span>
                  <h3 className="text-base font-semibold">{category.title}</h3>
                  <span className="ms-auto text-xs font-mono text-muted">
                    {String(category.skills.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, j) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + j * 0.03, duration: 0.3 }}
                      className="px-3 py-1.5 text-[13px] font-medium rounded-lg bg-surface-alt/80 text-foreground/90 border border-border/60 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}
