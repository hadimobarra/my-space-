"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useTheme } from "next-themes";
import { Briefcase, CornerDownLeft, FileText, Github, Hash, Languages, Linkedin, Mail, Moon, Search, Shuffle, type LucideIcon } from "lucide-react";
import { localePath, switchLocalePath, type Locale } from "@/lib/locale";
import { useSiteSearch } from "@/components/shared/use-site-search";
import { siteConfig } from "@/lib/site";

const EXTRA = ["now", "notes", "catalog", "fit", "hire", "corrections", "ai", "glossary", "questions", "weeks"] as const;

interface Item {
  href: string;
  title: string;
}

export interface CommandMenuProps {
  locale: Locale;
  labels: {
    placeholder: string;
    toggleTheme: string;
    toggleLanguage: string;
    allPosts: string;
    empty: string;
    inArticles: string;
    navigate: string;
    select: string;
    groups: { navigation: string; articles: string; actions: string; projects: string };
    nav: { about: string; projects: string; experience: string; skills: string; blog: string; contact: string; resume: string } & Record<(typeof EXTRA)[number], string> & { random: string };
  };
  posts: Item[];
  projects: Item[];
  translatedPosts: string[];
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  run: () => void;
}

export function CommandMenu({ locale, labels, posts, projects, translatedPosts, onClose }: CommandMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A native modal dialog brings the focus trap, Escape and focus restoration.
  // Layout effect: close() has to run before the element is removed to restore focus.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  const commands = useMemo<Command[]>(() => {
    const { groups, nav } = labels;
    const go = (path: string) => () => router.push(localePath(locale, path));
    const visit = (href: string) =>
      // The other language has its own root layout, so it needs a full page load.
      href.startsWith("/fa/") === (locale === "fa") ? router.push(href) : window.location.assign(href);
    const section = (id: "about" | "projects" | "experience" | "skills" | "contact"): Command => ({
      id, label: nav[id], group: groups.navigation, icon: Hash, run: go(`/#${id}`),
    });
    return [
      section("about"),
      section("projects"),
      section("experience"),
      section("skills"),
      { id: "resume", label: nav.resume, group: groups.navigation, icon: FileText, run: go("/resume/") },
      { id: "blog", label: labels.allPosts, group: groups.navigation, icon: FileText, run: go("/blog/") },
      ...EXTRA.map((id) => ({ id, label: nav[id], group: groups.navigation, icon: FileText, run: go(`/${id}/`) })),
      section("contact"),
      ...projects.map((p) => ({ id: p.href, label: p.title, group: groups.projects, icon: Briefcase, run: () => router.push(p.href) })),
      ...posts.map((p) => ({
        id: p.href, label: p.title, group: groups.articles, icon: FileText, run: () => visit(p.href),
      })),
      { id: "random", label: nav.random, group: groups.actions, icon: Shuffle, run: () => visit(posts[Math.floor(Math.random() * posts.length)].href) },
      { id: "theme", label: labels.toggleTheme, group: groups.actions, icon: Moon, run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark") },
      { id: "lang", label: labels.toggleLanguage, group: groups.actions, icon: Languages, run: () => window.location.assign(switchLocalePath(pathname, translatedPosts).href) },
      { id: "gh", label: "GitHub", group: groups.actions, icon: Github, run: () => window.open(siteConfig.links.github, "_blank", "noopener") },
      { id: "li", label: "LinkedIn", group: groups.actions, icon: Linkedin, run: () => window.open(siteConfig.links.linkedin, "_blank", "noopener") },
      { id: "mail", label: siteConfig.links.email, group: groups.actions, icon: Mail, run: () => window.location.assign(`mailto:${siteConfig.links.email}`) },
    ];
  }, [labels, locale, pathname, posts, projects, resolvedTheme, router, setTheme, translatedPosts]);

  const q = query.trim().toLowerCase();
  const matches = q ? commands.filter((c) => `${c.label} ${c.group}`.toLowerCase().includes(q)) : commands;

  // Full-text hits for pages the titles didn't already match
  const hits = useSiteSearch(query, 6);
  const listed = new Set(matches.map((c) => c.id));
  const filtered: Command[] = [
    ...matches,
    ...hits
      .filter((hit) => !listed.has(hit.url))
      .map((hit) => ({ id: hit.url, label: hit.title, group: labels.inArticles, icon: Search, run: () => window.location.assign(hit.url) })),
  ];

  const run = (command?: Command) => {
    if (!command) return;
    onClose();
    command.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const count = Math.max(filtered.length, 1);
    if (e.key === "ArrowDown") setSelected((s) => (s + 1) % count);
    else if (e.key === "ArrowUp") setSelected((s) => (s - 1 + count) % count);
    else if (e.key === "Enter") run(filtered[selected]);
    else return;
    e.preventDefault();
  };

  useEffect(() => {
    dialogRef.current?.querySelector(`#cmd-${selected}`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        // Let React state close it: the native close event arrives later and could undo a quick reopen.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={labels.placeholder}
      className="command-menu w-[calc(100%-2rem)] max-w-xl mx-auto mt-[12vh] glass-strong rounded-2xl shadow-2xl overflow-hidden text-foreground"
    >
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <Search size={18} className="text-muted shrink-0" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={filtered.length ? `cmd-${selected}` : undefined}
            aria-label={labels.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder={labels.placeholder}
            className="flex-1 bg-transparent text-sm placeholder:text-muted outline-none"
          />
          <kbd className="text-[10px] font-mono text-muted bg-surface-alt border border-border px-1.5 py-0.5 rounded-md">ESC</kbd>
        </div>
        <div id="cmd-list" role="listbox" aria-label={labels.placeholder} className="p-2 max-h-[min(60vh,420px)] overflow-y-auto">
          {filtered.map((cmd, i) => (
            <div key={cmd.id} role="presentation">
              {cmd.group !== filtered[i - 1]?.group && (
                <p role="presentation" className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {cmd.group}
                </p>
              )}
              <button
                id={`cmd-${i}`}
                type="button"
                role="option"
                aria-selected={i === selected}
                tabIndex={-1}
                onMouseMove={() => setSelected(i)}
                onClick={() => run(cmd)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-start",
                  i === selected ? "text-foreground bg-primary/10" : "text-muted"
                )}
              >
                <cmd.icon size={16} className={clsx("shrink-0", i === selected && "text-primary")} />
                <span dir="auto" className="flex-1 truncate">{cmd.label}</span>
                {i === selected && <CornerDownLeft size={14} className="text-muted rtl:-scale-x-100" />}
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p role="status" className="pb-10 text-center text-sm text-muted">{labels.empty}</p>}
        <div className="flex items-center gap-4 px-4 h-10 border-t border-border text-[11px] text-muted">
          <span><kbd className="font-mono">↑↓</kbd> {labels.navigate}</span>
          <span><kbd className="font-mono">↵</kbd> {labels.select}</span>
        </div>
      </div>
    </dialog>
  );
}
