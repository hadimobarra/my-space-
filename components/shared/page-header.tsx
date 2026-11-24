import type { ReactNode } from "react";

/** Hero band of the blog and case study index pages. */
export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden pt-32 pb-10 section-padding">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-60" />
        <div className="absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -top-20 right-1/4 w-[26rem] h-[26rem] rounded-full bg-violet/20 blur-[120px]" />
      </div>
      <div className="container-wide text-center">
        <p className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-border bg-card/70 text-xs font-medium text-muted">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 pb-1 gradient-text animate-rise">{title}</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}
