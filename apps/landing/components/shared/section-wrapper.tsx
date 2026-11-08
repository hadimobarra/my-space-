"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { TextReveal } from "./text-reveal";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  subtitle?: string;
  /** Small label shown above the title, e.g. "About" */
  eyebrow?: string;
}

export function SectionWrapper({
  id,
  children,
  className,
  containerClassName,
  title,
  subtitle,
  eyebrow,
}: SectionWrapperProps) {
  const { t } = useTranslation();
  const label = eyebrow ?? (id ? t(`eyebrows.${id}`, { defaultValue: id.replace(/-/g, " ") }) : undefined);

  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28 lg:py-32 section-padding", className)}
    >
      <div className={cn("container-wide", containerClassName)}>
        {title && (
          <div className="mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur text-xs font-medium tracking-wide uppercase text-muted"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-violet" />
              {label}
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <TextReveal text={title} inView />
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 h-[3px] w-16 origin-center rounded-full bg-gradient-to-r from-primary via-violet to-secondary"
            />
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 text-base md:text-lg text-muted max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
