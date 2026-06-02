"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import type { LucideIcon } from "lucide-react";
import { Code, Palette, Globe, Database, Smartphone, Server } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code,
  Palette,
  Globe,
  Database,
  Smartphone,
  Server,
};

interface Service {
  title: string;
  description: string;
  icon: string;
}

export function Services() {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as Service[];

  return (
    <SectionWrapper
      id="services"
      title={t("services.title")}
      subtitle={t("services.subtitle")}
      className="bg-surface/50"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = iconMap[service.icon] || Code;

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 text-center group hover:shadow-lg transition-all">
        <motion.div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-5"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">
          {service.description}
        </p>
      </div>
    </AnimatedElement>
  );
}
