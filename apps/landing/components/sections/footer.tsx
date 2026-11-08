"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/lib/seo";

export function Footer() {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("footer.explore"),
      links: [
        { label: t("nav.about"), href: "/#about" },
        { label: t("nav.projects"), href: "/#projects" },
        { label: t("nav.experience"), href: "/#experience" },
        { label: t("nav.contact"), href: "/#contact" },
      ],
    },
    {
      title: t("footer.writing"),
      links: [
        { label: t("footer.allArticles"), href: "/blog" },
        { label: "RSS", href: "/rss.xml" },
        { label: t("footer.resume"), href: "/resume.pdf" },
      ],
    },
  ];

  const socials = [
    { href: siteConfig.links.github, Icon: Github, label: "GitHub" },
    { href: siteConfig.links.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: `mailto:${siteConfig.links.email}`, Icon: Mail, label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[60rem] h-[24rem] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container-wide section-padding pt-20 pb-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-12 mb-16">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-md"
            >
              {t("footer.ctaTitle")} <span className="gradient-text-animated">{t("footer.ctaHighlight")}</span>
            </motion.h2>
            <p className="text-muted mb-6 max-w-sm">{t("footer.ctaText")}</p>
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="group inline-flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
            >
              {siteConfig.links.email}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <p className="text-sm text-muted flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t("footer.builtWith")}
            <Heart size={13} className="text-rose-500 fill-rose-500" />
          </p>
          <div className="flex items-center gap-2">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 hover:-translate-y-1 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
