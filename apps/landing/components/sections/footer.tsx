"use client";

import { Heart, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border bg-surface/80">
      <div className="container-wide px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted flex items-center gap-1">
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t("footer.madeWith")}{" "}
            <Heart size={14} className="text-red-400/80 fill-red-400/80 inline" />{" "}
            {t("footer.using")}
          </p>

          <div className="flex items-center gap-6">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/30 hover:shadow-sm transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
