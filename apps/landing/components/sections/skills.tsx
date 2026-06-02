"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

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
  category,
  index,
}: {
  category: { title: string; skills: { name: string; level: number }[] };
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 h-full">
        <h3 className="text-lg font-semibold mb-5">{category.title}</h3>
        <div className="space-y-4">
          {category.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted">{skill.level}%</span>
              </div>
              <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : {}}
                  transition={{
                    delay: index * 0.1,
                    duration: 1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedElement>
  );
}
