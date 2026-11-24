"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    // Cross-fade with the View Transitions API where supported
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="h-9 w-9 rounded-full flex items-center justify-center border border-border bg-card/50 hover:border-primary/30 transition-colors"
      aria-label={label}
    >
      {/* Both icons render; CSS picks one, so there is no hydration mismatch. */}
      <Moon size={16} className="text-muted dark:hidden" />
      <Sun size={16} className="text-amber-300 hidden dark:block" />
    </button>
  );
}
