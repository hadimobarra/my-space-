"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useLocaleStore } from "@/lib/store";

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    i18n.changeLanguage(locale);
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
