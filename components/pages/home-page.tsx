import { About } from "@/components/sections/about";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Contact } from "@/components/sections/contact";
import { Directions } from "@/components/sections/directions";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { OpenSource } from "@/components/sections/open-source";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Testimonials } from "@/components/sections/testimonials";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export function homeMetadata(locale: Locale) {
  const { seo } = getDictionary(locale);
  return pageMetadata({ locale, path: "/", title: seo.title, description: seo.description, absoluteTitle: true });
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <Hero locale={locale} t={t} />
      <About locale={locale} t={t} />
      <Projects locale={locale} t={t} />
      <Experience t={t} />
      <Directions locale={locale} />
      <OpenSource locale={locale} t={t} />
      <Skills t={t} />
      <BlogPreview locale={locale} t={t} />
      <Testimonials t={t} />
      <Contact locale={locale} t={t} />
    </>
  );
}
