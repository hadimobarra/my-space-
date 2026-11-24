import type { ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Footer } from "./footer";
import { Header } from "./header";
import { CommandMenuLoader } from "./command-menu-loader";
import { Analytics } from "@/components/shared/analytics";
import { PointerEffects } from "@/components/shared/pointer-effects";
import { getDictionary } from "@/lib/dictionary";
import { localeConfig, localePath, type Locale } from "@/lib/locale";
import { getAllPostSlugs, getPostListing } from "@/lib/mdx";
import { getProjects } from "@/lib/projects";
import { personJsonLd, websiteJsonLd } from "@/lib/seo";

const fonts: Record<Locale, string[]> = { en: ["geist-latin"], fa: ["vazirmatn-arabic", "vazirmatn-latin"] };

/** The <html> shell shared by the English and Persian root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale);

  return (
    <html lang={locale} dir={localeConfig[locale].dir} suppressHydrationWarning>
      <body id="top" className="min-h-screen flex flex-col antialiased">
        {/* React moves these to <head>. */}
        {fonts[locale].map((font) => (
          <link key={font} rel="preload" href={`/fonts/${font}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <a href="#main" className="skip-link">
            {t.nav.skipToContent}
          </a>
          <div aria-hidden className="scroll-progress" />
          <Header
            locale={locale}
            translatedPosts={getAllPostSlugs("fa")}
            labels={{
              about: t.nav.about,
              projects: t.nav.projects,
              experience: t.nav.experience,
              catalog: t.nav.catalog,
              notes: t.nav.notes,
              blog: t.nav.blog,
              resume: t.nav.resume,
              letsTalk: t.nav.letsTalk,
              search: t.commandMenu.search,
              openMenu: t.nav.openMenu,
              toggleTheme: t.nav.toggleTheme,
              switchLanguage: t.commandMenu.toggleLanguage,
              primary: t.nav.primary,
            }}
          />
          <CommandMenuLoader
            locale={locale}
            labels={{ ...t.commandMenu, inArticles: t.blog.inArticles, nav: t.nav }}
            translatedPosts={getAllPostSlugs("fa")}
            posts={getPostListing(locale).map((p) => ({ href: localePath(p.locale, `/blog/${p.slug}/`), title: p.frontmatter.title }))}
            projects={getProjects(locale).map((p) => ({ href: localePath(locale, `/projects/${p.slug}/`), title: p.frontmatter.title }))}
          />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer locale={locale} />
          <a href="#top" aria-label={t.footer.backToTop} className="back-to-top">
            <ArrowUp size={18} />
          </a>
        </ThemeProvider>
        {[personJsonLd(locale), websiteJsonLd(locale)].map((data) => (
          <script key={data["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
        ))}
        <PointerEffects />
        <Analytics />
      </body>
    </html>
  );
}
