// Locale helpers that are safe to import from client components (no dictionaries).

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const localeConfig = {
  en: { dir: "ltr", label: "English", short: "EN", og: "en_US" },
  fa: { dir: "rtl", label: "فارسی", short: "FA", og: "fa_IR" },
} as const satisfies Record<Locale, { dir: "ltr" | "rtl"; label: string; short: string; og: string }>;

/** "/blog/" → "/blog/" (en) or "/fa/blog/" (fa). English lives at the root. */
export function localePath(locale: Locale, path = "/"): string {
  return locale === "en" ? path : `/fa${path}`;
}

/** The same page in the other language. Articles are English-only, so they map to the Persian blog index. */
export function switchLocalePath(pathname: string): { locale: Locale; href: string } {
  const isFa = pathname === "/fa" || pathname.startsWith("/fa/");
  if (isFa) return { locale: "en", href: pathname.slice(3) || "/" };
  return { locale: "fa", href: `/fa${pathname.startsWith("/blog/") ? "/blog/" : pathname}` };
}

/** Fill {placeholders} in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
