"use client";

import { useEffect } from "react";

/** One delegated listener drives the pointer glow of every `.spotlight` element. */
export function PointerEffects() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let el = (e.target as Element | null)?.closest<HTMLElement>(".spotlight, .spotlight-area");
        // A card can sit inside the hero's spotlight area, so update the ancestors too.
        while (el) {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          el.style.setProperty("--my", `${e.clientY - rect.top}px`);
          el = el.parentElement?.closest<HTMLElement>(".spotlight, .spotlight-area");
        }
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);
  return null;
}
