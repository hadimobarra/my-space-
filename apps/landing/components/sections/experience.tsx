"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import { Badge } from "@/components/ui/badge";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export function Experience() {
  const { t } = useTranslation();
  const items = t("experience.items", { returnObjects: true }) as ExperienceItem[];

  return (
    <SectionWrapper
      id="experience"
      title={t("experience.title")}
      subtitle={t("experience.subtitle")}
      className="bg-surface/50"
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />
        <div className="space-y-12">
          {items.map((item, i) => (
            <ExperienceCard key={`${item.company}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function ExperienceCard({ item, index }: { item: ExperienceItem; index: number }) {
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
        <div className="w-10 h-10 rounded-full bg-card border-2 border-secondary flex items-center justify-center shadow-md">
          <Building2 size={18} className="text-secondary" />
        </div>
      </motion.div>

      <AnimatedElement delay={index * 0.2} direction="up">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Calendar size={12} />
              {item.period}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
          <p className="text-sm text-muted mb-3">{item.company}</p>
          <p className="text-sm text-muted leading-relaxed">{item.description}</p>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </AnimatedElement>
    </div>
  );
}
