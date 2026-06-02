"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

export function Testimonials() {
  const { t } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as Testimonial[];

  return (
    <SectionWrapper
      id="testimonials"
      title={t("testimonials.title")}
      subtitle={t("testimonials.subtitle")}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((testimonial, i) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <div className="glass-card rounded-2xl p-6 h-full group hover:shadow-lg transition-all">
        <Quote size={20} className="text-primary/30 mb-3" />
        <p className="text-sm text-muted leading-relaxed mb-5 italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted">{testimonial.role}</p>
        </div>
      </div>
    </AnimatedElement>
  );
}
