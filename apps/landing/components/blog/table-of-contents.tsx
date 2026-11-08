"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/mdx";

/** Sticky TOC that highlights the heading currently being read. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const onScroll = () => {
      // The active heading is the last one whose top has passed 30% of the viewport
      const threshold = window.innerHeight * 0.3;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= threshold) current = el.id;
        else break;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label={t("blog.onThisPage")}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{t("blog.onThisPage")}</p>
      <ul className="relative border-s border-border space-y-1">
        {headings.map((h) => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-indicator"
                  className="absolute -start-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-violet rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  history.replaceState(null, "", `#${h.id}`);
                }}
                className={cn(
                  "block py-1 text-[13px] leading-snug transition-colors",
                  h.level === 3 ? "ps-7" : "ps-4",
                  isActive ? "text-primary font-medium" : "text-muted hover:text-foreground"
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
