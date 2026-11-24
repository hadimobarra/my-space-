/* eslint-disable @next/next/no-img-element -- screenshots are already optimised; static export has no optimiser */
import { Check, HelpCircle, Minus, X } from "lucide-react";
import { PageShell, textLink } from "@/components/site/page-shell";
import { TwoDirections } from "@/components/site/two-directions";
import { checks, reports, type Result } from "@/content/rtl";
import type { Locale } from "@/lib/locale";
import { pageMetadata, siteConfig } from "@/lib/seo";

const copy = {
  en: { title: "RTL report card", description: "How Apache Superset and OpenMetadata behave in Persian: direction, text, dates and charts, with screenshots and test code.", intro: "How open-source data tools behave in Persian. Measured on default settings with a small Persian dataset, 24 November 2026. The tools are free and built by volunteers and companies who welcome fixes, so read this as a to-do list.", drag: "Drag to compare English and Persian", method: "Method", methodText: "Each tool ran in its official container. A browser opened five screens in English and Persian and recorded the language and direction attributes, the side of the navigation and how many visible texts contain Persian letters. Screenshots were checked by eye. This is a pilot: two tools, desktop only, no keyboard or screen reader testing.", code: "Test code and raw results", labels: { yes: "Yes", partly: "Partly", no: "No", unknown: "Not tested" } as Record<Result, string> },
  fa: { title: "کارنامه راست‌به‌چپ", description: "رفتار Apache Superset و OpenMetadata در فارسی: جهت، متن، تاریخ و نمودار، همراه تصویر و کد آزمون.", intro: "ابزارهای متن‌باز داده در فارسی چگونه رفتار می‌کنند. با تنظیمات پیش‌فرض و یک مجموعه‌داده کوچک فارسی، ۳ آذر ۱۴۰۵. این ابزارها رایگان‌اند و از اصلاح استقبال می‌کنند؛ این صفحه را فهرست کار بدانید.", drag: "برای مقایسه انگلیسی و فارسی بکشید", method: "روش", methodText: "هر ابزار در کانتینر رسمی خود اجرا شد. مرورگر پنج صفحه را به انگلیسی و فارسی باز کرد و ویژگی زبان و جهت، سمت ناوبری و تعداد متن‌های دارای حروف فارسی را ثبت کرد. تصاویر با چشم بررسی شدند. این یک نمونه اولیه است: دو ابزار، فقط دسکتاپ، بدون آزمون صفحه‌کلید و صفحه‌خوان.", code: "کد آزمون و نتایج خام", labels: { yes: "بله", partly: "تا حدی", no: "خیر", unknown: "آزموده نشده" } as Record<Result, string> },
};

const icons = { yes: Check, partly: Minus, no: X, unknown: HelpCircle };
const colors = { yes: "text-[#046c4e] dark:text-accent", partly: "text-amber-700 dark:text-amber-400", no: "text-rose-700 dark:text-rose-400", unknown: "text-muted" };

export const rtlMetadata = (locale: Locale) => pageMetadata({ locale, path: "/rtl/", title: copy[locale].title, description: copy[locale].description });

export function RtlPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <PageShell wide title={t.title} intro={t.intro}>
      {reports.map((r) => (
        <section key={r.id} className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6"><bdi>{r.name} {r.version}</bdi></h2>
          <table className="w-full text-sm mb-10">
            <tbody>
              {checks.map((c) => {
                const [result, note] = r.results[c.id];
                const Icon = icons[result];
                return (
                  <tr key={c.id} className="border-b border-border/60 align-top">
                    <th scope="row" className="text-start font-medium py-3 pe-5 w-1/3">{c.label[locale]}</th>
                    <td className={`py-3 pe-5 whitespace-nowrap font-semibold ${colors[result]}`}><Icon size={15} aria-hidden className="inline -mt-0.5 me-1.5" />{t.labels[result]}</td>
                    <td className="py-3 text-muted">{note[locale]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {r.screens.map((s) => (
            <figure key={s.id} className="mb-8">
              <TwoDirections label={`${t.drag}: ${s.label[locale]}`}
                left={<img src={`/rtl/${r.id}-${s.id}-en.webp`} alt={`${r.name}, ${s.label.en}, English`} width={1280} height={800} loading="lazy" className="w-full" />}
                right={<img src={`/rtl/${r.id}-${s.id}-fa.webp`} alt={`${r.name}, ${s.label.en}, Persian`} width={1280} height={800} loading="lazy" className="w-full" />} />
              <figcaption className="mt-3 text-sm text-muted text-center">{s.label[locale]}. {t.drag}</figcaption>
            </figure>
          ))}
        </section>
      ))}
      <h2 className="text-2xl font-bold tracking-tight mb-3">{t.method}</h2>
      <p className="text-muted leading-relaxed max-w-2xl mb-4">{t.methodText}</p>
      <a href={`${siteConfig.links.source}/tree/main/rtl-report`} className={textLink}>{t.code}</a>
    </PageShell>
  );
}
