"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  title?: string;
  subtitle?: string;
}

export function SectionWrapper({
  id,
  children,
  className,
  containerClassName,
  title,
  subtitle,
}: SectionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id={id}
      className={cn("py-20 md:py-28 lg:py-32 section-padding", className)}
    >
      <div
        ref={ref}
        className={cn("container-wide", containerClassName)}
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
