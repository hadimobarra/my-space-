"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import type { Heading } from "@/lib/mdx";

/** Sticky TOC that highlights the heading currently being read. */
export function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    let frame = 0;
    const update = () => {
      // The active heading is the last one whose top has passed 30% of the viewport
      const threshold = window.innerHeight * 0.3;
      const passed = elements.filter((el) => el.getBoundingClientRect().top <= threshold);
      setActive((passed.at(-1) ?? elements[0]).id);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label={label}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{label}</p>
      <ul className="border-s border-border space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={clsx(
                "block py-1 -ms-px border-s-2 text-[13px] leading-snug transition-colors",
                h.level === 3 ? "ps-7" : "ps-4",
                active === h.id ? "border-primary text-primary font-medium" : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
