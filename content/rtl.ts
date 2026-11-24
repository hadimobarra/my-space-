import type { Locale } from "@/lib/locale";

type Text = Record<Locale, string>;
const t = (en: string, fa: string): Text => ({ en, fa });

export type Result = "yes" | "partly" | "no" | "unknown";

export const checks = [
  { id: "offered", label: t("Persian can be chosen", "فارسی قابل انتخاب است") },
  { id: "text", label: t("Interface text is Persian", "متن رابط فارسی است") },
  { id: "lang", label: t("Page declares its language", "صفحه زبان خود را اعلام می‌کند") },
  { id: "dir", label: t("Page is right-to-left", "صفحه راست‌به‌چپ است") },
  { id: "nav", label: t("Navigation moves to the right", "ناوبری به راست می‌رود") },
  { id: "paths", label: t("File paths stay readable", "مسیر فایل خوانا می‌ماند") },
  { id: "titles", label: t("Long Persian titles are cut at the end", "عنوان بلند از انتها کوتاه می‌شود") },
  { id: "charts", label: t("Chart labels join correctly", "برچسب نمودار درست می‌چسبد") },
  { id: "calendar", label: t("Solar Hijri dates", "تاریخ خورشیدی") },
] as const;

type CheckId = (typeof checks)[number]["id"];

export interface ToolReport {
  id: string;
  name: string;
  version: string;
  results: Record<CheckId, [Result, Text]>;
  screens: { id: string; label: Text }[];
}

const dash = t("Not tested yet", "هنوز آزموده نشده");

export const reports: ToolReport[] = [
  {
    id: "superset", name: "Apache Superset", version: "6.1.0",
    results: {
      offered: ["partly", t("After editing the configuration. The official image contains no compiled translations, so the interface stays in English until you build them.", "پس از ویرایش پیکربندی. تصویر رسمی ترجمه کامپایل‌شده ندارد و تا ساخت آن‌ها رابط انگلیسی می‌ماند.")],
      text: ["partly", t("With translations built: 160 of 192 visible texts in five screens contain Persian. Some are wrong guesses.", "پس از ساخت ترجمه: ۱۶۰ متن از ۱۹۲ متن دیده‌شده در پنج صفحه فارسی دارد. برخی حدس نادرست‌اند.")],
      lang: ["no", t("The lang attribute is empty.", "ویژگی lang خالی است.")],
      dir: ["no", t("No dir attribute; every Persian text sits in a left-to-right container.", "ویژگی dir ندارد و همه متن‌های فارسی در ظرف چپ‌به‌راست‌اند.")],
      nav: ["no", t("Logo and menu stay on the left.", "لوگو و منو سمت چپ می‌مانند.")],
      paths: ["yes", t("Readable, because the whole page is left-to-right.", "خوانا، چون کل صفحه چپ‌به‌راست است.")],
      titles: ["no", t("The dashboard title lost its first letters instead of its last.", "عنوان داشبورد به‌جای انتها، ابتدای خود را از دست داد.")],
      charts: ["yes", t("Bar and line chart labels are joined correctly.", "برچسب‌های نمودار میله‌ای و خطی درست چسبیده‌اند.")],
      calendar: ["no", t("The time axis shows English Gregorian months.", "محور زمان ماه میلادی انگلیسی نشان می‌دهد.")],
    },
    screens: [{ id: "dashboard", label: t("Dashboard", "داشبورد") }, { id: "charts", label: t("Chart list", "فهرست نمودارها") }],
  },
  {
    id: "openmetadata", name: "OpenMetadata", version: "1.12.14",
    results: {
      offered: ["yes", t("In the language menu, shown as PR. The code for Persian is fa.", "در منوی زبان، با کد PR. کد فارسی fa است.")],
      text: ["partly", t("141 of 197 visible texts in five screens contain Persian. Settings are mostly English.", "۱۴۱ متن از ۱۹۷ متن دیده‌شده در پنج صفحه فارسی دارد. تنظیمات بیشتر انگلیسی است.")],
      lang: ["no", t("Still lang=\"en\" after switching.", "پس از تغییر زبان همچنان lang=\"en\" است.")],
      dir: ["no", t("No dir attribute; sentences end with the full stop on the wrong side.", "ویژگی dir ندارد؛ نقطه پایان جمله در سمت نادرست است.")],
      nav: ["no", t("The sidebar stays on the left.", "نوار کناری سمت چپ می‌ماند.")],
      paths: ["unknown", dash], titles: ["unknown", dash], charts: ["unknown", dash], calendar: ["unknown", dash],
    },
    screens: [{ id: "explore", label: t("Explore", "کاوش") }, { id: "settings", label: t("Settings", "تنظیمات") }],
  },
];
