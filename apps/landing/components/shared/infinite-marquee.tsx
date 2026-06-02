"use client";

import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  items: { name: string; color?: string }[];
  direction?: "left" | "right";
  className?: string;
}

export function InfiniteMarquee({
  items,
  direction = "left",
  className,
}: InfiniteMarqueeProps) {
  const itemsJsx = items.map((item, i) => (
    <span
      key={i}
      className="inline-flex items-center gap-3 mx-6"
    >
      <span
        className="text-sm font-bold px-4 py-2 rounded-full bg-surface border border-border whitespace-nowrap"
      >
        {item.name}
      </span>
    </span>
  ));

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex animate-marquee"
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {itemsJsx}
        {itemsJsx}
      </div>
    </div>
  );
}
