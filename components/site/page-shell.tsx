import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Plain reading page: title, introduction, content. */
export function PageShell({ title, intro, wide = false, children }: { title: string; intro: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <div className="pt-32 pb-24 section-padding">
      <div className={cn("mx-auto", wide ? "max-w-5xl" : "max-w-2xl")}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{title}</h1>
        <div className="text-lg text-muted leading-relaxed mb-12 max-w-2xl">{intro}</div>
        {children}
      </div>
    </div>
  );
}

export const textLink = "underline underline-offset-4 decoration-border hover:text-primary";
