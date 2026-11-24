"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu, Search, X } from "lucide-react";
import { localeConfig, localePath, switchLocalePath, type Locale } from "@/lib/locale";
import { ThemeToggle } from "./theme-toggle";

const SECTIONS = ["about", "projects", "experience", "catalog", "blog", "notes"] as const;
/** Nav items that open a page instead of scrolling the home page. */
const PAGES = { catalog: "/catalog/", blog: "/blog/", notes: "/notes/", resume: "/resume/" } as const;

type NavId = (typeof SECTIONS)[number] | "resume";

export interface HeaderLabels extends Record<NavId, string> {
  letsTalk: string;
  search: string;
  openMenu: string;
  toggleTheme: string;
  switchLanguage: string;
  primary: string;
}

export function Header({ locale, labels, translatedPosts }: { locale: Locale; labels: HeaderLabels; translatedPosts: string[] }) {
  const pathname = usePathname();
  const home = localePath(locale);
  const path = locale === "fa" ? pathname.slice(3) || "/" : pathname;
  const isHome = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState("");

  const links = ([...SECTIONS, "resume"] as NavId[]).map((id) => ({
    id,
    label: labels[id],
    href: id in PAGES ? localePath(locale, PAGES[id as keyof typeof PAGES]) : `${home}#${id}`,
  }));

  const current = isHome
    ? section
    : path.startsWith("/blog") ? "blog"
    : path.startsWith("/projects") ? "projects"
    : path.startsWith("/resume") ? "resume"
    : path.startsWith("/catalog") ? "catalog"
    : path.startsWith("/notes") ? "notes"
    : "";

  const { locale: otherLocale, href: otherHref } = switchLocalePath(pathname, translatedPosts);

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setSection(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // While the mobile menu is open: lock scrolling and close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 inset-x-0 z-50 px-3 md:px-6 pt-3 transition-transform duration-500 focus-within:translate-y-0 print:hidden",
          hidden && !menuOpen && "-translate-y-[120%]"
        )}
      >
        <div
          className={clsx(
            "container-wide flex items-center justify-between gap-3 h-14 md:h-16 px-3 md:px-4 rounded-2xl border transition-all duration-500",
            scrolled || !isHome || menuOpen ? "glass-strong shadow-lg shadow-black/[0.04]" : "border-transparent"
          )}
        >
          <Link href={home} className="group flex items-center gap-2.5">
            <span aria-hidden className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#0e7490] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/30">
              HM
            </span>
            <span className="sr-only sm:not-sr-only text-sm font-semibold tracking-tight">Hadi Mobarra</span>
          </Link>

          <nav aria-label={labels.primary} className="hidden lg:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={current === link.id ? (isHome ? "location" : "page") : undefined}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                  current === link.id ? "text-primary bg-primary/[0.07] ring-1 ring-primary/20" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("command-menu"))}
              className="flex items-center justify-center gap-2 h-9 w-9 md:w-auto md:ps-3 md:pe-1.5 rounded-full text-xs text-muted border border-border bg-card/50 hover:border-primary/30 hover:text-foreground transition-colors"
              aria-haspopup="dialog"
            >
              <Search size={14} />
              <span className="sr-only xl:not-sr-only">{labels.search}</span>
              <kbd aria-hidden dir="ltr" className="hidden md:inline text-[10px] font-mono bg-surface-alt px-1.5 py-0.5 rounded-md border border-border">⌘K</kbd>
            </button>
            {/* A full page load on purpose: each language has its own root layout. */}
            <a
              href={otherHref}
              hrefLang={otherLocale}
              lang={otherLocale}
              className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border border-border bg-card/50 hover:border-primary/30 transition-colors"
            >
              <span aria-hidden>{localeConfig[otherLocale].short}</span>
              <span lang={locale} className="sr-only">{labels.switchLanguage}</span>
            </a>
            <ThemeToggle label={labels.toggleTheme} />
            <Link
              href={`${home}#contact`}
              className="btn-gradient hidden md:inline-flex items-center justify-center h-9 px-4 rounded-full text-xs font-semibold"
            >
              {labels.letsTalk}
            </Link>
            <button
              type="button"
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={labels.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-20 lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => setMenuOpen(false)} />
          <nav id="mobile-menu" aria-label={labels.primary} className="relative glass-strong mx-3 rounded-2xl p-3 flex flex-col gap-1 shadow-2xl">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  current === link.id ? "text-primary bg-primary/10" : "text-foreground hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`${home}#contact`}
              onClick={() => setMenuOpen(false)}
              className="btn-gradient mt-2 flex items-center justify-center h-11 rounded-full text-sm font-semibold"
            >
              {labels.letsTalk}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
