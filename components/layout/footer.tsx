import Link from "next/link";
import { ArrowUpRight, Github, Heart, Linkedin, Mail } from "lucide-react";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

export const socialLinks = [
  { href: siteConfig.links.github, Icon: Github, label: "GitHub" },
  { href: siteConfig.links.linkedin, Icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${siteConfig.links.email}`, Icon: Mail, label: "Email" },
];

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const to = (path: string) => localePath(locale, path);

  const columns = [
    {
      title: t.footer.explore,
      links: [
        { label: t.nav.about, href: to("/#about") },
        { label: t.footer.caseStudies, href: to("/projects/") },
        { label: t.nav.experience, href: to("/#experience") },
        { label: t.nav.contact, href: to("/#contact") },
      ],
    },
    {
      title: t.footer.writing,
      links: [
        { label: t.footer.allArticles, href: to("/blog/") },
        { label: t.footer.resume, href: to("/resume/") },
        { label: t.nav.notes, href: to("/notes/") },
        { label: "RSS", href: to("/rss.xml"), external: true },
        { label: t.footer.source, href: siteConfig.links.source, external: true },
      ],
    },
    {
      title: t.nav.more,
      links: [
        { label: t.nav.rtl, href: to("/rtl/") },
        { label: t.nav.hire, href: to("/hire/") },
        { label: t.nav.catalog, href: to("/catalog/") },
        { label: t.nav.fit, href: to("/fit/") },
        { label: t.nav.corrections, href: to("/corrections/") },
        { label: t.nav.ai, href: to("/ai/") },
      ],
    },
    {
      title: t.nav.now,
      links: [
        { label: t.nav.now, href: to("/now/") },
        { label: t.nav.questions, href: to("/questions/") },
        { label: t.nav.weeks, href: to("/weeks/") },
        { label: t.nav.glossary, href: to("/glossary/") },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border print:hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[60rem] h-[24rem] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container-wide section-padding pt-20 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-12 mb-16">
          <div>
            <p className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-md">
              {t.footer.ctaTitle} <span className="gradient-text">{t.footer.ctaHighlight}</span>
            </p>
            <p className="text-muted mb-6 max-w-sm">{t.footer.ctaText}</p>
            <a
              href={`mailto:${siteConfig.links.email}`}
              dir="ltr"
              data-track="email"
              className="group inline-flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
            >
              {siteConfig.links.email}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {"external" in l ? (
                      <a href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">{l.label}</a>
                    ) : (
                      <Link href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <p className="text-sm text-muted flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t.footer.builtWith}
            <Heart size={13} className="text-rose-500 fill-rose-500" aria-label={t.footer.love} role="img" />
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                rel="noopener noreferrer"
                aria-label={label}
                data-track={label.toLowerCase()}
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors"
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
