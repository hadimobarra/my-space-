"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Briefcase, Award, GitCommit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

export function About() {
  const { t } = useTranslation();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Code, value: "10+", label: t("about.stats.projects") },
    { icon: Briefcase, value: "30+", label: t("about.stats.technologies") },
    { icon: Award, value: "4+", label: t("about.stats.experience") },
    { icon: GitCommit, value: "1K+", label: t("about.stats.contributions") },
  ];

  return (
    <SectionWrapper
      id="about"
      title={t("about.title")}
      subtitle={t("about.subtitle")}
      className="bg-surface/50"
    >
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <AnimatedElement direction="left">
          <div className="space-y-5">
            <p
              className="text-base md:text-lg text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t("about.para1") }}
            />
            <p
              className="text-base md:text-lg text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t("about.para2") }}
            />
            <p
              className="text-base md:text-lg text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t("about.para3") }}
            />
          </div>
        </AnimatedElement>

        <AnimatedElement direction="right" delay={0.2}>
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-md transition-all"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-primary" />
                <motion.span
                  className="text-3xl font-bold gradient-text block"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-sm text-muted mt-1 block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatedElement>
      </div>
    </SectionWrapper>
  );
}
