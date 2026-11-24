import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  eyebrow: string;
  className?: string;
  children: ReactNode;
}

export function SectionWrapper({ id, title, subtitle, eyebrow, className, children }: SectionWrapperProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative py-20 md:py-28 section-padding", className)}>
      <div className="container-wide">
        <div className="reveal mb-12 md:mb-16 text-center">
          <p className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-border bg-card/60 text-xs font-medium tracking-wide uppercase text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-violet" />
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {title}
          </h2>
          <div aria-hidden className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-primary via-violet to-secondary" />
          {subtitle && <p className="mt-5 text-base md:text-lg text-muted max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
