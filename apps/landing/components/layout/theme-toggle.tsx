"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // true on the client, false during SSR — avoids a hydration mismatch on the icon
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    // Use the View Transitions API for a smooth cross-fade where supported
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  return (
    <button
      onClick={toggle}
      className="h-9 w-9 rounded-full flex items-center justify-center border border-border bg-card/50 hover:border-primary/30 transition-colors overflow-hidden"
      aria-label="Toggle theme"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ y: 16, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -16, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.25 }}
          >
            {isDark ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-muted" />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
