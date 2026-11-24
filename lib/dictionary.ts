import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import type { Locale } from "./locale";

export type Dictionary = typeof en;

// Typing `fa` as Dictionary makes a missing translation a build error.
const dictionaries: Record<Locale, Dictionary> = { en, fa };

/** Server-side only: client components receive just the strings they need as props. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
