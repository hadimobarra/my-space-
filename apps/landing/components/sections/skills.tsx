"use client";

import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

const categoryIcons: Record<string, string> = {
  Languages: "💬",
  "Frameworks & Libraries": "⚛️",
  "فریم‌ورک‌ها و کتابخانه‌ها": "⚛️",
  "UI / Styling": "🎨",
  "UI / استایل": "🎨",
  Tooling: "🛠️",
  ابزارها: "🛠️",
  "Data & Protocols": "📡",
  "داده و پروتکل‌ها": "📡",
  Platforms: "☁️",
  پلتفرم‌ها: "☁️",
};

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
      className="bg-surface/50"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, i) => (
          <SkillCard key={category.title} category={category} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function SkillCard({
  category, index,
}: {
  category: { title: string; skills: { name: string; level: number }[] };
  index: number;
}) {
  return (
    <AnimatedElement delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 h-full group hover:shadow-lg transition-all">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <span className="text-xl">{categoryIcons[category.title] || "📦"}</span>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {category.title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <span
              key={skill.name}
              className="px-3.5 py-2 text-sm font-medium rounded-xl bg-surface-alt text-foreground border border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </AnimatedElement>
  );
}


