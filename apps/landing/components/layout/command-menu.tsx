"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCommandStore } from "@/lib/store";

export function CommandMenu() {
  const { t } = useTranslation();
  const { isOpen, close, toggle } = useCommandStore();

  const commands = [
    { label: t("nav.home"), action: "#hero" },
    { label: t("nav.about"), action: "#about" },
    { label: t("nav.skills"), action: "#skills" },
    { label: t("nav.projects"), action: "#projects" },
    { label: t("nav.experience"), action: "#experience" },
    { label: t("nav.blog"), action: "#blog" },
    { label: t("nav.contact"), action: "#contact" },
    { label: t("commandMenu.toggleTheme"), action: "theme" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, close]);

  const handleSelect = (action: string) => {
    close();
    if (action === "theme") {
      document.documentElement.classList.toggle("dark");
    } else {
      document.getElementById(action.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={18} className="text-muted" />
              <input
                autoFocus
                placeholder={t("commandMenu.placeholder")}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-light outline-none"
              />
              <kbd className="text-[10px] text-muted bg-surface-alt px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  onClick={() => handleSelect(cmd.action)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-surface transition-colors text-left"
                >
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
