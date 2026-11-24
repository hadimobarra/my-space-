import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div aria-hidden className="absolute start-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-violet to-secondary hidden md:block" />
      <ol className="space-y-10">{children}</ol>
    </div>
  );
}

export function TimelineItem({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <li className="relative md:ps-16 reveal">
      <span aria-hidden className="absolute start-0 top-6 hidden md:flex w-10 h-10 rounded-full bg-card border-2 border-primary shadow-lg shadow-primary/20 items-center justify-center">
        <Icon size={17} className="text-primary" />
      </span>
      {children}
    </li>
  );
}
