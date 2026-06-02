"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useNavStore, useCommandStore, useLocaleStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { ScrollProgress } from "./scroll-progress";

export function Header() {
  const { t } = useTranslation();
  const { activeSection, setActiveSection, isMobileMenuOpen, setMobileMenuOpen } = useNavStore();
  const { open: openCommand } = useCommandStore();
  const { locale, setLocale } = useLocaleStore();
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.blog"), href: "#blog" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "about", "skills", "projects", "experience", "blog", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommand();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCommand]);

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "fa" : "en");
  };

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass-strong shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container-wide flex items-center justify-between px-4 md:px-8 h-16 md:h-18">
          <Link
            href="/"
            className="text-lg font-bold gradient-text-blue"
          >
            HM
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeSection === link.href.slice(1)
                    ? "text-primary bg-primary/5"
                    : "text-muted hover:text-foreground hover:bg-surface"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary/30 transition-colors"
              aria-label="Toggle language"
            >
              {locale === "en" ? "FA" : "EN"}
            </button>
            <button
              onClick={openCommand}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted border border-border hover:border-primary/30 transition-colors"
            >
              <kbd className="text-[10px] bg-surface-alt px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden md:inline-flex items-center justify-center h-9 px-4 rounded-full text-xs font-medium bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {t("nav.letsTalk")}
            </a>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-16 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="relative glass-strong mx-4 mt-2 rounded-2xl p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeSection === link.href.slice(1)
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:bg-surface"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 pt-2 border-t border-border">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-11 w-full rounded-full text-sm font-medium bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-sm hover:shadow-lg transition-all"
                >
                  {t("nav.letsTalk")}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
