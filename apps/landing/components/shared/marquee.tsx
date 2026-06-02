"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
}

export function Marquee({ children, className }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
