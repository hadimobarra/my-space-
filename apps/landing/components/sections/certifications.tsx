"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export function Certifications() {
  const { t } = useTranslation();
  const items = t("certifications.items", { returnObjects: true }) as Certification[];

  return (
    <SectionWrapper
      id="certifications"
      title={t("certifications.title")}
      subtitle={t("certifications.subtitle")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((cert, i) => (
          <CertCard key={cert.name} cert={cert} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <motion.div
        className="glass-card rounded-2xl p-5 flex items-start gap-4 group hover:shadow-md transition-all"
        whileHover={{ x: 3 }}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
          <Award size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors">
            {cert.name}
          </h3>
          <p className="text-xs text-muted">{cert.issuer}</p>
          <p className="text-xs text-muted mt-1">{cert.date}</p>
        </div>
      </motion.div>
    </AnimatedElement>
  );
}
