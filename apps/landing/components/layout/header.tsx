"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavStore, useCommandStore, useLocaleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { ScrollProgress } from "./scroll-progress";

const SECTIONS = ["hero", "about", "skills", "projects", "experience", "blog", "contact"] as const;

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBlog = pathname.startsWith("/blog");
  const { activeSection, setActiveSection, isMobileMenuOpen, setMobileMenuOpen } = useNavStore();
  const { open: openCommand } = useCommandStore();
  const { locale, setLocale } = useLocaleStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 30);
    setHidden(y > 400 && y > prev && !isMobileMenuOpen);
  });

  const navLinks = SECTIONS.map((id) => ({
    id,
    label: t(`nav.${id === "hero" ? "home" : id}`),
    // The blog nav item goes to the full blog; everything else to a home anchor
    href: id === "blog" ? "/blog" : isHome ? `#${id}` : `/#${id}`,
  }));

  const current = isBlog ? "blog" : isHome ? activeSection : "";

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveSection, isHome]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommand();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommand]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-3 md:px-6 pt-3"
      >
        <div
          className={cn(
            "container-wide flex items-center justify-between gap-3 h-14 md:h-16 px-3 md:px-4 rounded-2xl transition-all duration-500",
            scrolled || !isHome
              ? "glass-strong shadow-lg shadow-black/[0.04]"
              : "bg-transparent border border-transparent"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Home">
            <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-violet to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/30 transition-transform duration-500 group-hover:rotate-[360deg]">
              HM
            </span>
            <span className="hidden sm:block text-sm font-semibold tracking-tight">
              Hadi Mobarra
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-full">
            {navLinks.map((link) => {
              const active = current === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={openCommand}
              className="hidden md:flex items-center gap-2 h-9 ps-3 pe-1.5 rounded-full text-xs text-muted border border-border bg-card/50 hover:border-primary/30 hover:text-foreground transition-colors"
              aria-label="Open command menu"
            >
              <Search size={14} />
              <span className="hidden xl:inline">{t("commandMenu.search")}</span>
              <kbd className="text-[10px] font-mono bg-surface-alt px-1.5 py-0.5 rounded-md border border-border">⌘K</kbd>
            </button>
            <button
              onClick={() => setLocale(locale === "en" ? "fa" : "en")}
              className="h-9 w-9 rounded-full text-xs font-semibold border border-border bg-card/50 hover:border-primary/30 transition-colors"
              aria-label="Toggle language"
            >
              {locale === "en" ? "FA" : "EN"}
            </button>
            <ThemeToggle />
            <Link
              href={isHome ? "#contact" : "/#contact"}
              className="btn-gradient hidden md:inline-flex items-center justify-center h-9 px-4 rounded-full text-xs font-semibold"
            >
              {t("nav.letsTalk")}
            </Link>
            <button
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMobileMenuOpen ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pt-20 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass-strong mx-3 rounded-2xl p-3 flex flex-col gap-1 shadow-2xl"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      current === link.id
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-surface"
                    )}
                  >
                    {link.label}
                    <span className="text-[10px] font-mono text-muted">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 pt-3 border-t border-border">
                <Link
                  href={isHome ? "#contact" : "/#contact"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gradient flex items-center justify-center h-11 w-full rounded-full text-sm font-semibold"
                >
                  {t("nav.letsTalk")}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
