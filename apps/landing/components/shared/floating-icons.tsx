"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const icons = [
  { name: "React", color: "#61DAFB", darkColor: "#93d0e8", x: 15, y: 20, size: 28 },
  { name: "Next.js", color: "#000000", darkColor: "#a0aec0", x: 80, y: 15, size: 26 },
  { name: "TypeScript", color: "#3178C6", darkColor: "#6395d6", x: 10, y: 70, size: 24 },
  { name: "Tailwind", color: "#06B6D4", darkColor: "#5eead4", x: 85, y: 75, size: 28 },
  { name: "JavaScript", color: "#F7DF1E", darkColor: "#f5d742", x: 90, y: 40, size: 22 },
  { name: "Git", color: "#F05032", darkColor: "#f07a5a", x: 20, y: 50, size: 22 },
];

export function FloatingIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((icon, i) => (
        <motion.div
          key={icon.name}
          className="absolute"
          style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-background/80 dark:bg-surface/80 shadow-lg border border-border/50 backdrop-blur-sm"
            title={icon.name}
          >
            <span
              className="text-lg font-bold"
              style={{ color: mounted && resolvedTheme === "dark" ? icon.darkColor : icon.color }}
            >
              {icon.name.charAt(0)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
