"use client";

import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";

interface LearningItem {
  name: string;
  description: string;
}

export function CurrentlyLearning() {
  const { t } = useTranslation();
  const items = t("currentlyLearning.items", { returnObjects: true }) as LearningItem[];
  const loop = [...items, ...items];

  return (
    <SectionWrapper
      id="currently-learning"
      title={t("currentlyLearning.title")}
      subtitle={t("currentlyLearning.subtitle")}
      className="bg-surface/60 overflow-hidden"
    >
      <div className="relative flex overflow-hidden mask-fade-x group" dir="ltr">
        <div className="flex shrink-0 gap-4 pe-4 animate-marquee [animation-duration:45s] group-hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 w-[300px] shrink-0 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center">
                  <Sparkles size={13} className="text-primary" />
                </span>
                <span className="text-sm font-semibold">{item.name}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
