"use client";

import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { Code, Palette, Globe, Database, Smartphone, Server, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { SpotlightCard } from "@/components/shared/spotlight-card";

const iconMap: Record<string, LucideIcon> = { Code, Palette, Globe, Database, Smartphone, Server };

interface Service {
  title: string;
  description: string;
  icon: string;
}

export function Services() {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as Service[];

  return (
    <SectionWrapper id="services" title={t("services.title")} subtitle={t("services.subtitle")}>
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
        {items.map((service, i) => {
          const Icon = iconMap[service.icon] || Code;
          return (
            <StaggerItem key={service.title} className="h-full">
              <SpotlightCard className="p-7 h-full group">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-violet to-secondary p-[1px] shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-full h-full rounded-[15px] bg-card flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  {service.title}
                  <ArrowUpRight size={16} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted leading-relaxed">{service.description}</p>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}
