"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

export function Education() {
  const { t } = useTranslation();
  const items = t("education.items", { returnObjects: true }) as {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];

  return (
    <SectionWrapper
      id="education"
      title={t("education.title")}
      subtitle={t("education.subtitle")}
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />
        <div className="space-y-12">
          {items.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: { degree: string; institution: string; period: string; description: string };
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative pl-0 md:pl-14">
      <motion.div
        className="absolute left-0 top-1 hidden md:block"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
      >
        <div className="w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-md">
          <GraduationCap size={18} className="text-primary" />
        </div>
      </motion.div>

      <AnimatedElement delay={index * 0.2} direction="up">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
            {item.period}
          </span>
          <h3 className="text-xl font-semibold mb-1">{item.degree}</h3>
          <p className="text-sm text-muted mb-3">{item.institution}</p>
          <p className="text-sm text-muted leading-relaxed">{item.description}</p>
        </div>
      </AnimatedElement>
    </div>
  );
}
