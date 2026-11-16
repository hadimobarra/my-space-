"use client";

import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

const avatarGradients = [
  "from-primary to-violet",
  "from-secondary to-primary",
  "from-violet to-secondary",
  "from-accent to-secondary",
];

export function Testimonials() {
  const { t } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as Testimonial[];

  return (
    <SectionWrapper id="testimonials" title={t("testimonials.title")} subtitle={t("testimonials.subtitle")}>
      <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.1}>
        {items.map((item, i) => (
          <StaggerItem key={item.name} className="h-full">
            <SpotlightCard className="relative p-7 md:p-8 h-full flex flex-col overflow-hidden">
              <Quote aria-hidden size={88} className="absolute -top-3 end-4 text-primary/[0.07] rotate-180" />
              <p className="relative text-[15px] text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-5 mt-auto border-t border-border">
                <span
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                >
                  {item.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                </div>
              </div>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
