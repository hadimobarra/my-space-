import Link from "next/link";
import { ChevronRight, Database, User } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { TwoDirections } from "@/components/site/two-directions";
import { localeConfig, localePath, type Locale } from "@/lib/locale";

const copy = {
  en: { eyebrow: "English ⇆ فارسی", title: "One interface, two directions", subtitle: "Drag the handle. Same component, same CSS: only the language and direction change.", label: "Compare the English and Persian versions", link: "How do real data tools do it? See the RTL report card" },
  fa: { eyebrow: "فارسی ⇆ English", title: "یک رابط، دو جهت", subtitle: "دستگیره را بکشید. همان کامپوننت و همان CSS؛ فقط زبان و جهت عوض می‌شود.", label: "مقایسه نسخه فارسی و انگلیسی", link: "ابزارهای واقعی داده چگونه‌اند؟ کارنامه راست‌به‌چپ" },
};

const sample = {
  en: { path: ["Catalog", "Sales", "Orders"], title: "Orders", desc: "Every order placed in the online shop, refreshed hourly.", owner: "Owner: Data team", rows: "Rows", updated: "Updated", quality: "Quality", file: "File" },
  fa: { path: ["کاتالوگ", "فروش", "سفارش‌ها"], title: "سفارش‌ها", desc: "همه سفارش‌های ثبت‌شده در فروشگاه اینترنتی، با به‌روزرسانی ساعتی.", owner: "مالک: تیم داده", rows: "ردیف‌ها", updated: "به‌روزرسانی", quality: "کیفیت", file: "فایل" },
};

function Panel({ locale }: { locale: Locale }) {
  const t = sample[locale];
  const intl = locale === "fa" ? "fa-IR" : "en-US";
  const stats = [
    [t.rows, new Intl.NumberFormat(intl).format(1284502)],
    [t.updated, new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 10, 24)))],
    [t.quality, new Intl.NumberFormat(intl, { style: "percent" }).format(0.98)],
  ];
  return (
    <div lang={locale} dir={localeConfig[locale].dir} className="h-full p-6 md:p-10 bg-card">
      <p className="flex items-center gap-1.5 text-xs text-muted mb-5">
        {t.path.map((part, i) => (
          <span key={part} className="contents">{i > 0 && <ChevronRight size={13} aria-hidden className="rtl:rotate-180" />}{part}</span>
        ))}
      </p>
      <p className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-2"><Database size={26} aria-hidden className="text-primary" /> {t.title}</p>
      <p className="text-sm text-muted mb-5 max-w-md">{t.desc}</p>
      <p className="inline-flex items-center gap-2 text-xs rounded-full bg-surface-alt px-3 py-1.5 mb-6"><User size={13} aria-hidden /> {t.owner}</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(([label, value]) => (
          <div key={label} className="border-s-4 border-primary bg-surface rounded-e-xl ps-3 pe-2 py-3">
            <p className="text-[11px] text-muted">{label}</p>
            <p className="text-sm md:text-base font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden mb-5"><div className="h-full w-[98%] bg-accent" /></div>
      <p className="text-xs text-muted">{t.file}: <bdi dir="ltr" className="font-mono">/warehouse/sales/orders (final).parquet</bdi></p>
    </div>
  );
}

export function Directions({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <SectionWrapper id="directions" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} className="bg-surface/60">
      <div className="max-w-4xl mx-auto"><TwoDirections label={t.label} left={<Panel locale="en" />} right={<Panel locale="fa" />} /></div>
      <p className="text-center mt-8"><Link href={localePath(locale, "/rtl/")} className="font-semibold text-primary underline underline-offset-4">{t.link}</Link></p>
    </SectionWrapper>
  );
}
