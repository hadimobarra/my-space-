"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Splits text into words that rise into place with a stagger. */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  inView = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view instead of on mount */
  inView?: boolean;
}) {
  const words = text.split(" ");
  const trigger = inView
    ? { whileInView: "visible", viewport: { once: true, margin: "-80px" } }
    : { animate: "visible" };

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.08em]" aria-hidden>
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={{
              hidden: { y: "110%", opacity: 0, rotate: 4 },
              visible: {
                y: "0%",
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}
