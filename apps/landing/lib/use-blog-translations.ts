"use client";

import { useTranslation } from "react-i18next";

export function useBlogTranslations() {
  const { t } = useTranslation();
  return {
    blog: t("blog.title"),
    description: t("blog.description"),
    readMore: t("blog.readMore"),
    minRead: t("blog.minRead"),
    noPosts: t("blog.noPosts"),
    backToBlog: t("blog.backToBlog"),
    comingSoon: t("blog.comingSoon"),
  };
}
