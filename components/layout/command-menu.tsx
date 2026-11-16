"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, FileText, Moon, Languages, CornerDownLeft, Github, Linkedin, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useCommandStore, useLocaleStore } from "@/lib/store";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface CommandPost {
  slug: string;
  title: string;
}

type Command = {
  id: string;
  label: string;
  group: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  run: () => void;
};

export function CommandMenu({ posts = [] }: { posts?: CommandPost[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, close } = useCommandStore();
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const goToSection = (id: string) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const commands: Command[] = useMemo(() => {
    const nav = t("commandMenu.groups.navigation");
    const articles = t("commandMenu.groups.articles");
    const actions = t("commandMenu.groups.actions");
    const sections = [
      ["hero", "home"], ["about", "about"], ["skills", "skills"], ["projects", "projects"],
      ["experience", "experience"], ["blog", "blog"], ["contact", "contact"],
    ] as const;
    return [
      ...sections.map(([id, key]) => ({
        id: `s-${id}`, label: t(`nav.${key}`), group: nav, icon: Hash, run: () => goToSection(id),
      })),
      { id: "all-posts", label: t("commandMenu.allPosts"), group: nav, icon: FileText, run: () => router.push("/blog") },
      ...posts.map((p) => ({
        id: `p-${p.slug}`, label: p.title, group: articles, icon: FileText, run: () => router.push(`/blog/${p.slug}`),
      })),
      {
        id: "theme", label: t("commandMenu.toggleTheme"), group: actions, icon: Moon,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "lang", label: t("commandMenu.toggleLanguage"), group: actions, icon: Languages,
        run: () => setLocale(locale === "en" ? "fa" : "en"),
      },
      { id: "gh", label: "GitHub", group: actions, icon: Github, run: () => window.open(siteConfig.links.github, "_blank") },
      { id: "li", label: "LinkedIn", group: actions, icon: Linkedin, run: () => window.open(siteConfig.links.linkedin, "_blank") },
      { id: "mail", label: siteConfig.links.email, group: actions, icon: Mail, run: () => (window.location.href = `mailto:${siteConfig.links.email}`) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, posts, pathname, resolvedTheme, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset the palette each time it opens (derived-state pattern, no effect needed)
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setSelected(0);
    }
  }

  const runCommand = (cmd: Command | undefined) => {
    if (!cmd) return;
    close();
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (s + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => (s - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[selected]);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  // Group while keeping a flat index for keyboard selection
  let flatIndex = -1;
  const groups = filtered.reduce<Record<string, Command[]>>((acc, c) => {
    (acc[c.group] ||= []).push(c);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          onKeyDown={onKeyDown}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("commandMenu.placeholder")}
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl glass-strong rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
              <Search size={18} className="text-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(0);
                }}
                placeholder={t("commandMenu.placeholder")}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
              />
              <kbd className="text-[10px] font-mono text-muted bg-surface-alt border border-border px-1.5 py-0.5 rounded-md">ESC</kbd>
            </div>
            <div ref={listRef} className="p-2 max-h-[min(60vh,420px)] overflow-y-auto">
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-muted">{t("commandMenu.empty")}</p>
              )}
              {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{group}</p>
                  {items.map((cmd) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    const active = idx === selected;
                    return (
                      <button
                        key={cmd.id}
                        data-index={idx}
                        onMouseMove={() => setSelected(idx)}
                        onClick={() => runCommand(cmd)}
                        className={cn(
                          "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-start transition-colors",
                          active ? "text-foreground" : "text-muted"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="cmd-active"
                            className="absolute inset-0 rounded-xl bg-primary/10"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}
                        <cmd.icon size={16} className={cn("relative shrink-0", active && "text-primary")} />
                        <span className="relative flex-1 truncate">{cmd.label}</span>
                        {active && <CornerDownLeft size={14} className="relative text-muted" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 h-10 border-t border-border text-[11px] text-muted">
              <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> {t("commandMenu.navigate")}</span>
              <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> {t("commandMenu.select")}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
