"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Vertical timeline whose connecting line draws itself as you scroll. */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      <div className="absolute start-5 top-2 bottom-2 w-px bg-border hidden md:block" />
      <motion.div
        style={{ scaleY }}
        className="absolute start-5 top-2 bottom-2 w-px origin-top bg-gradient-to-b from-primary via-violet to-secondary hidden md:block"
      />
      <div className="space-y-10">{children}</div>
    </div>
  );
}

export function TimelineItem({
  icon: Icon,
  children,
  accent = "primary",
}: {
  icon: LucideIcon;
  children: ReactNode;
  accent?: "primary" | "secondary";
}) {
  return (
    <div className="relative md:ps-16">
      <motion.div
        className="absolute start-0 top-6 hidden md:block"
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <div
          className={cn(
            "relative w-10 h-10 rounded-full bg-card border-2 flex items-center justify-center shadow-lg",
            accent === "primary" ? "border-primary shadow-primary/20" : "border-secondary shadow-secondary/20"
          )}
        >
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping-slow opacity-30",
              accent === "primary" ? "bg-primary" : "bg-secondary"
            )}
          />
          <Icon size={17} className={accent === "primary" ? "text-primary" : "text-secondary"} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
