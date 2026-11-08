"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

/** Floating button with a circular scroll-progress ring. */
export function BackToTop() {
  const { scrollYProgress, scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 600));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 end-6 z-40 w-12 h-12 rounded-full glass-strong shadow-lg flex items-center justify-center group"
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r="22" fill="none" strokeWidth="2" className="stroke-border" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-primary"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp size={18} className="text-foreground transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
