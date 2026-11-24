import type { Metadata } from "next";
import { getDictionary } from "./dictionary";
import { localeConfig, localePath, type Locale } from "./locale";
import { siteConfig } from "./site";

export { siteConfig };

/** Absolute URL; page paths always end in a slash, like the exported files. */
export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

const RSS = { "application/rss+xml": absoluteUrl("/rss.xml") };

interface PageMetadataInput {
  locale: Locale;
  /** Locale-less path with a trailing slash, e.g. "/blog/". */
  path: string;
  title: string;
  description: string;
  /** Use the title as is, without the "| Hadi Mobarra" suffix. */
  absoluteTitle?: boolean;
  image?: string;
  /** False for pages that exist in one language only. */
  translated?: boolean;
  article?: { publishedTime: string; tags: string[] };
}

/**
 * Complete metadata for one page. Next replaces nested objects such as `openGraph`
 * and `alternates` instead of merging them, so every page must state all of them.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  image = siteConfig.ogImage,
  translated = true,
  article,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localePath(locale, path));
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const images = [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }];

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    alternates: {
      canonical: url,
      languages: translated
        ? {
            en: absoluteUrl(localePath("en", path)),
            fa: absoluteUrl(localePath("fa", path)),
            "x-default": absoluteUrl(localePath("en", path)),
          }
        : undefined,
      types: RSS,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: localeConfig[locale].og,
      images,
      ...(article
        ? { type: "article" as const, publishedTime: article.publishedTime, tags: article.tags, authors: [siteConfig.url] }
        : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: images.map((i) => i.url) },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export function personJsonLd(locale: Locale) {
  const t = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    alternateName: "هادی مبرا",
    givenName: "Hadi",
    familyName: "Mobarra",
    jobTitle: "Front-End Engineer",
    description: t.seo.description,
    url: siteConfig.url,
    email: siteConfig.links.email,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    knowsAbout: ["React", "Next.js", "TypeScript", "JavaScript", "Front-End Development", "Web Development", "Apache Superset", "OpenMetadata", "Data Visualization"],
    knowsLanguage: ["en", "fa"],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Iran University of Science and Technology" },
    image: absoluteUrl("/images/profile.jpeg"),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
    author: { "@id": `${siteConfig.url}/#person` },
    description: getDictionary(locale).seo.description,
  };
}
