import type { ReactNode } from "react";

export const demoButton =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-50";

export function DemoFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="glass-card rounded-2xl p-5 md:p-7 print:hidden">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">{title}</p>
      {children}
    </section>
  );
}
