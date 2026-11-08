"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 inset-x-0 z-[60] h-[2px] origin-left rtl:origin-right bg-gradient-to-r from-primary via-violet to-secondary"
      style={{ scaleX }}
    />
  );
}
