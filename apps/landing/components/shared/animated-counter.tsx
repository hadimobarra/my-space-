"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up from 0 to the numeric part of `value` ("1K+", "30+", "4") once in view. */
export function AnimatedCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? value;
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!inView || !match || reduce) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className={className}>
      {match ? `${prefix}${reduce && inView ? target : display}${suffix}` : value}
    </span>
  );
}
