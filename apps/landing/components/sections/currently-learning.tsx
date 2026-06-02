"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import { Marquee } from "@/components/shared/marquee";

interface LearningItem {
  name: string;
  description: string;
}

export function CurrentlyLearning() {
  const { t } = useTranslation();
  const items = t("currentlyLearning.items", { returnObjects: true }) as LearningItem[];

  return (
    <SectionWrapper
      id="currently-learning"
      title={t("currentlyLearning.title")}
      subtitle={t("currentlyLearning.subtitle")}
    >
      <Marquee>
        {items.map((item, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-5 mx-3 min-w-[280px] group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                {item.name}
              </span>
            </div>
            <p className="text-xs text-muted">{item.description}</p>
          </div>
        ))}
      </Marquee>
    </SectionWrapper>
  );
}
