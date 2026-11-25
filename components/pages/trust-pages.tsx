import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogFilter } from "@/components/site/catalog-filter";
import { FitChecker } from "@/components/site/fit-checker";
import { PageShell, textLink } from "@/components/site/page-shell";
import { TrustBadge, trustLabels } from "@/components/site/trust-badge";
import { claims, skillIndex, trustCounts, type Kind, type Trust } from "@/content/catalog";
import { getDictionary } from "@/lib/dictionary";
import { formatDate, formatNumber } from "@/lib/format";
import { localePath, type Locale } from "@/lib/locale";
import { pageMetadata, siteConfig } from "@/lib/seo";

const meta = (copy: Record<Locale, { title: string; description: string }>, path: string) => (locale: Locale) =>
  pageMetadata({ locale, path, title: copy[locale].title, description: copy[locale].description });

/** Proof links are written for English pages; articles stay there, everything else follows the language. */
const proofHref = (href: string, locale: Locale) => (href.startsWith("/") && !href.startsWith("/fa/") && !/^\/blog\/./.test(href) ? localePath(locale, href) : href);

// ───────────────────────── Catalog

const catalogCopy = {
  en: { title: "Career catalog", description: "Every claim Hadi Mobarra makes, with its proof and a label that says how far you can trust it.", intro: "I build data catalogs, which answer “where did this come from, and can I trust it?”. Here is the same for what I say about myself.", counts: "claims", search: "Search claims or skills", all: "All", empty: "No claim matches.", noProof: "No public proof", fit: "Check these against a job description", kinds: { openSource: "Open source", work: "Work", craft: "Craft", education: "Education" } as Record<Kind, string> },
  fa: { title: "کاتالوگ حرفه‌ای", description: "هر ادعای هادی مبرا همراه سند آن و برچسبی که می‌گوید چقدر می‌توان به آن اعتماد کرد.", intro: "من کاتالوگ داده می‌سازم که پاسخ می‌دهد «این از کجا آمده و آیا قابل اعتماد است؟». اینجا همان را درباره گفته‌های خودم می‌بینید.", counts: "ادعا", search: "جست‌وجوی ادعا یا مهارت", all: "همه", empty: "ادعایی پیدا نشد.", noProof: "بدون سند عمومی", fit: "مقایسه با آگهی شغلی", kinds: { openSource: "متن‌باز", work: "کار", craft: "مهارت", education: "تحصیل" } as Record<Kind, string> },
};
export const catalogMetadata = meta(catalogCopy, "/catalog/");

export function CatalogPage({ locale }: { locale: Locale }) {
  const t = catalogCopy[locale];
  const n = (v: number) => formatNumber(v, locale);
  return (
    <PageShell wide title={t.title} intro={<><p>{t.intro}</p><p className="mt-4 text-sm flex flex-wrap gap-x-6 gap-y-2">{(Object.keys(trustCounts) as Trust[]).map((k) => <span key={k}><strong className="text-foreground">{n(trustCounts[k])}</strong> {trustLabels[k][locale]}</span>)}</p><p className="mt-4 text-sm"><Link href={localePath(locale, "/fit/")} className={textLink}>{t.fit}</Link></p></>}>
      <CatalogFilter
        labels={{ search: t.search, all: t.all, empty: t.empty }}
        filters={(Object.keys(trustLabels) as Trust[]).map((value) => ({ value, label: trustLabels[value][locale] }))}
        items={claims.map((c) => ({
          id: c.id,
          trust: c.trust,
          search: `${c.text[locale]} ${c.skills.join(" ")}`.toLowerCase(),
          node: (
            <article className="glass-card rounded-2xl p-5 md:p-6">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted mb-3"><TrustBadge trust={c.trust} locale={locale} /> {t.kinds[c.kind]} · {c.when[locale]}</p>
              <p className="font-medium leading-relaxed mb-3">{c.text[locale]}</p>
              <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {c.proofs.length === 0 && <span className="text-muted">{t.noProof}</span>}
                {c.proofs.map((p) => <a key={p.href} href={proofHref(p.href, locale)} className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4">{p.label[locale]} <ArrowUpRight size={13} aria-hidden className="rtl:-scale-x-100" /></a>)}
              </p>
            </article>
          ),
        }))}
      />
    </PageShell>
  );
}

// ───────────────────────── Job fit

const fitCopy = {
  en: { title: "Does this job fit?", description: "Paste a job description and see which requirements Hadi Mobarra can prove, and which are missing. Runs in your browser.", intro: "Paste a job description. You'll see what I can prove, what you'd have to take my word for, and what I don't have. It looks for known terms only, and the text never leaves your browser.", labels: { paste: "Job description", check: "Check", proven: "With proof", word: "My word only", missing: "Not in my catalog", none: "None found.", years: "Asked: {asked}+ years. I have {have}.", yearsOk: "", yearsShort: "That is less than the posting asks for.", nothing: "No known terms found in this text." } },
  fa: { title: "آیا این شغل مناسب است؟", description: "متن آگهی شغلی را وارد کنید و ببینید هادی مبرا کدام نیازها را با سند دارد و کدام را ندارد. در مرورگر شما اجرا می‌شود.", intro: "متن آگهی را وارد کنید. می‌بینید چه چیزی را با سند دارم، چه چیزی فقط گفته خودم است و چه چیزی را ندارم. فقط اصطلاحات شناخته‌شده انگلیسی بررسی می‌شوند و متن از مرورگر شما خارج نمی‌شود.", labels: { paste: "متن آگهی", check: "بررسی", proven: "همراه سند", word: "فقط گفته خودم", missing: "در کاتالوگ من نیست", none: "موردی پیدا نشد.", years: "خواسته‌شده: {asked} سال یا بیشتر. من {have} سال دارم.", yearsOk: "", yearsShort: "این کمتر از مقدار خواسته‌شده است.", nothing: "اصطلاح شناخته‌شده‌ای در متن پیدا نشد." } },
};
export const fitMetadata = meta(fitCopy, "/fit/");

export function FitPage({ locale }: { locale: Locale }) {
  const t = fitCopy[locale];
  return (
    <PageShell title={t.title} intro={t.intro}>
      <FitChecker skills={skillIndex(locale)} years={4} labels={t.labels} catalogHref={localePath(locale, "/catalog/")} />
    </PageShell>
  );
}

// ───────────────────────── Corrections

interface Correction { date: string; kind: "published" | "theory"; said: Record<Locale, string>; truth: Record<Locale, string>; href?: string }

const corrections: Correction[] = [
  { date: "2026-11-24", kind: "published", href: "/blog/", said: { en: "Ten articles carried dates between September 2025 and October 2026.", fa: "ده مقاله تاریخی بین سپتامبر ۲۰۲۵ و اکتبر ۲۰۲۶ داشتند." }, truth: { en: "They were all added to this site on 8 November 2026, as the commit history shows. They now carry that date.", fa: "همه آن‌ها طبق تاریخچه کامیت‌ها در ۸ نوامبر ۲۰۲۶ به این سایت اضافه شدند و اکنون همان تاریخ را دارند." } },
  { date: "2026-11-24", kind: "published", href: "/blog/taming-inp-interaction-to-next-paint/", said: { en: "My INP article said that yielding lets the browser paint.", fa: "مقاله INP من می‌گفت yield کردن به مرورگر اجازه رسم می‌دهد." }, truth: { en: "It allows a paint without guaranteeing one. A demo I built for the article showed the next frame arriving after all the work. The article now waits for a frame first.", fa: "اجازه می‌دهد ولی تضمین نمی‌کند. دمویی که برای همان مقاله ساختم نشان داد فریم بعدی پس از پایان همه کار آمد. مقاله اکنون اول منتظر فریم می‌ماند." } },
  { date: "2026-11-24", kind: "published", href: "/projects/this-website/", said: { en: "The case study of this site listed 230–240 ms of blocking time.", fa: "مطالعه موردی این سایت زمان مسدودی را ۲۳۰ تا ۲۴۰ میلی‌ثانیه اعلام می‌کرد." }, truth: { en: "That came from a local server. On GitHub Pages it was 280–700 ms, about the same as before the rebuild. The table now shows the live numbers.", fa: "آن عدد از سرور محلی بود. روی GitHub Pages مقدار ۲۸۰ تا ۷۰۰ میلی‌ثانیه بود، تقریباً مثل قبل از بازسازی. جدول اکنون عدد واقعی را نشان می‌دهد." } },
  { date: "2026-11-24", kind: "published", said: { en: "This site listed OpenMetadata at 5,200 stars, typed in by hand.", fa: "این سایت تعداد ستاره‌های OpenMetadata را دستی ۵٬۲۰۰ نوشته بود." }, truth: { en: "It had 15,859. The numbers now come from the GitHub API.", fa: "مقدار واقعی ۱۵٬۸۵۹ بود. اعداد اکنون از GitHub API می‌آیند." } },
  { date: "2026-11-24", kind: "published", said: { en: "It described a Superset typography change as a fix I had made.", fa: "یک تغییر تایپوگرافی Superset را اصلاح انجام‌شده من معرفی کرده بود." }, truth: { en: "The pull request was still open. It's now shown as “in review”.", fa: "درخواست ادغام هنوز باز بود. اکنون «در حال بازبینی» نمایش داده می‌شود." } },
  { date: "2026-11-24", kind: "published", href: "/blog/frontend-performance/", said: { en: "My performance guide taught First Input Delay.", fa: "راهنمای پرفورمنس من First Input Delay را آموزش می‌داد." }, truth: { en: "INP had replaced it, as another article of mine already said. The guide is rewritten.", fa: "INP جایگزین آن شده بود، چنان‌که مقاله دیگری از خودم می‌گفت. راهنما بازنویسی شد." } },
  { date: "2026-11-24", kind: "theory", href: "/blog/less-javascript-same-blocking-time/", said: { en: "Less JavaScript will cut blocking time.", fa: "جاوااسکریپت کمتر زمان مسدودی را کم می‌کند." }, truth: { en: "127 KB less made no clear difference to it, although the page appears in half the time.", fa: "۱۲۷ کیلوبایت کمتر تفاوت روشنی ایجاد نکرد، هرچند صفحه در نصف زمان ظاهر می‌شود." } },
  { date: "2026-11-24", kind: "theory", href: "/blog/less-javascript-same-blocking-time/", said: { en: "A shorter homepage will cut blocking time.", fa: "صفحه اصلی کوتاه‌تر زمان مسدودی را کم می‌کند." }, truth: { en: "A fifth fewer elements: medians of 125 ms before and 134 ms after.", fa: "یک‌پنجم عنصر کمتر: میانه ۱۲۵ میلی‌ثانیه قبل و ۱۳۴ بعد." } },
  { date: "2026-11-24", kind: "theory", said: { en: "A broad CSS rule slows the Persian homepage.", fa: "یک قانون کلی CSS صفحه اصلی فارسی را کند می‌کند." }, truth: { en: "Replacing it changed nothing in six alternating runs.", fa: "تعویض آن در شش اجرای نوبتی هیچ تغییری نداد." } },
  { date: "2026-10-01", kind: "theory", href: "/blog/safari-blank-chart-exports/", said: { en: "Unit tests are enough for a Safari rendering fix.", fa: "تست واحد برای اصلاح رندر Safari کافی است." }, truth: { en: "They proved the setting was passed on, not that charts appeared. A reviewer with real Safari found a dependency mismatch that my tests couldn't see.", fa: "فقط ثابت کردند تنظیم منتقل می‌شود، نه اینکه نمودار ظاهر می‌شود. بازبینی با Safari واقعی ناسازگاری نسخه‌ای یافت که تست‌های من نمی‌دیدند." } },
];

const correctionsCopy = {
  en: { title: "Corrections", description: "What Hadi Mobarra got wrong, when, and what changed because of it.", intro: "What I got wrong, and what changed. If you find something else, tell me and it goes here.", published: "Published and corrected", theory: "Theories that failed", was: "I said", is: "In fact", report: "Report a mistake" },
  fa: { title: "اصلاحات", description: "آنچه هادی مبرا اشتباه گفته، زمان آن و تغییری که در پی داشت.", intro: "آنچه اشتباه گفتم و آنچه تغییر کرد. اگر مورد دیگری دیدید بگویید تا اینجا اضافه شود.", published: "منتشر و سپس اصلاح شد", theory: "فرضیه‌هایی که رد شدند", was: "گفته بودم", is: "در واقع", report: "گزارش اشتباه" },
};
export const correctionsMetadata = meta(correctionsCopy, "/corrections/");

export function CorrectionsPage({ locale }: { locale: Locale }) {
  const t = correctionsCopy[locale];
  return (
    <PageShell title={t.title} intro={<p>{t.intro} <a href={`https://github.com/${siteConfig.links.repository}/issues/new`} className={textLink}>{t.report}</a></p>}>
      {(["published", "theory"] as const).map((kind) => (
        <section key={kind} className="mb-14">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t[kind]}</h2>
          <ul className="space-y-8">
            {corrections.filter((c) => c.kind === kind).map((c) => (
              <li key={c.said.en} className="border-s-2 border-border ps-5">
                <time dateTime={c.date} className="text-xs text-muted">{formatDate(c.date, locale)}</time>
                <p className="mt-1"><strong>{t.was}:</strong> {c.said[locale]}</p>
                <p className="mt-2 text-muted leading-relaxed"><strong className="text-foreground">{t.is}:</strong> {c.truth[locale]}</p>
                {c.href && <p className="mt-2 text-sm"><a href={proofHref(c.href, locale)} className={textLink}>{c.href.startsWith("/blog") ? (locale === "fa" ? "مقاله" : "Article") : (locale === "fa" ? "صفحه" : "Page")}</a></p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PageShell>
  );
}

// ───────────────────────── How I use AI

const aiCopy = {
  en: { title: "How I use AI", description: "Which parts of this site an AI assistant worked on, and how that is checked.", intro: "Trust is easier when you know how something was made.",
    sections: [
      ["What AI did", ["An AI assistant, Claude, co-wrote the code of this site.", "It also drafted the articles and case studies published so far, from my pull requests, my résumé and measurements.", "It helped with translations between English and Persian."]],
      ["How it's checked", ["Technical claims link to sources: pull requests, issues, specifications and test results.", "Numbers are measured, with the method next to them. Wrong ones are listed under Corrections.", "Automated tests run before every deploy, including tests of the demos the articles rely on."]],
      ["What it doesn't do", ["It doesn't invent experience, employers, numbers or recommendations.", "The recommendations on the homepage were written by the people who signed them.", "Nothing you type into the job-fit checker or the search is sent to an AI, or anywhere else."]],
    ] as [string, string[]][], own: "Articles rewritten in my own words", none: "None yet. They will be listed here.", history: "Commit history", corrections: "Corrections" },
  fa: { title: "استفاده من از هوش مصنوعی", description: "کدام بخش‌های این سایت با دستیار هوش مصنوعی ساخته شده و چگونه بررسی می‌شود.", intro: "وقتی بدانید چیزی چگونه ساخته شده، اعتماد آسان‌تر است.",
    sections: [
      ["کاری که هوش مصنوعی کرد", ["دستیار هوش مصنوعی Claude در نوشتن کد این سایت مشارکت داشته است.", "مقاله‌ها و مطالعات موردی منتشرشده تا امروز را نیز از روی درخواست‌های ادغام، رزومه و اندازه‌گیری‌های من پیش‌نویس کرده است.", "در ترجمه بین انگلیسی و فارسی کمک کرده است."]],
      ["چگونه بررسی می‌شود", ["ادعاهای فنی به منبع پیوند دارند: درخواست ادغام، ایشو، مشخصات فنی و نتیجه تست.", "اعداد اندازه‌گیری شده‌اند و روش کنارشان آمده است. موارد نادرست در صفحه اصلاحات فهرست می‌شوند.", "پیش از هر انتشار تست‌های خودکار اجرا می‌شوند، از جمله تست دموهایی که مقاله‌ها بر آن‌ها تکیه دارند."]],
      ["کاری که نمی‌کند", ["تجربه، کارفرما، عدد یا توصیه‌نامه ساختگی نمی‌سازد.", "توصیه‌نامه‌های صفحه اصلی را امضاکنندگانشان نوشته‌اند.", "آنچه در بررسی شغل یا جست‌وجو می‌نویسید به هوش مصنوعی یا جای دیگری فرستاده نمی‌شود."]],
    ] as [string, string[]][], own: "مقاله‌هایی که به قلم خودم بازنویسی شده‌اند", none: "هنوز هیچ‌کدام. اینجا فهرست خواهند شد.", history: "تاریخچه کامیت‌ها", corrections: "اصلاحات" },
};
export const aiMetadata = meta(aiCopy, "/ai/");

export function AiPage({ locale }: { locale: Locale }) {
  const t = aiCopy[locale];
  return (
    <PageShell title={t.title} intro={t.intro}>
      {t.sections.map(([title, items]) => (
        <section key={title} className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4">{title}</h2>
          <ul className="space-y-2.5 list-disc ps-5 marker:text-primary leading-relaxed">{items.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      ))}
      <h2 className="text-xl font-bold tracking-tight mb-4">{t.own}</h2>
      <p className="text-muted mb-8">{t.none}</p>
      <p className="flex gap-6 text-sm"><a href={`${siteConfig.links.source}/commits/main`} className={textLink}>{t.history}</a><Link href={localePath(locale, "/corrections/")} className={textLink}>{t.corrections}</Link></p>
    </PageShell>
  );
}

// ───────────────────────── Hire me

const hireCopy = {
  en: { title: "Hire me, in plain words", description: "What Hadi Mobarra is looking for, where the help is strongest, and when to look for someone else.", intro: "No buzzwords. What I'm looking for, what I'm good at and when you should look for someone else.", pronounce: "My name", sayIt: "HAH-dee mo-bar-RAH", audio: "هادی مبرا", looking: "What I'm looking for", lookingItems: ["A remote front-end role, full-time or contract.", "Products where data is the hard part: catalogs, pipelines, dashboards, admin consoles.", "Teams that work asynchronously and review each other's code."], help: "Where I help most", not: "When I'm probably not the right person", notItems: ["You need back-end, native mobile or brand design work. My production experience is in React and TypeScript front ends.", "You need someone on site. I work from Tehran (UTC+3:30).", "You need more than about four years of professional experience."], check: "Before you write", checks: [["Check your job description against my catalog", "/fit/"], ["See the proof behind each claim", "/catalog/"], ["Read the résumé", "/resume/"], ["See what I got wrong", "/corrections/"]] as [string, string][], next: "Next step", ask: "Ask me something in public", contact: "Write to me" },
  fa: { title: "همکاری با من، ساده و روشن", description: "هادی مبرا دنبال چه کاری است، کجا بیشترین کمک را می‌کند و چه زمانی گزینه مناسبی نیست.", intro: "بدون شعار: دنبال چه هستم، در چه کاری خوبم و چه زمانی بهتر است سراغ کس دیگری بروید.", pronounce: "تلفظ نام", sayIt: "هادی مُبَرّا", audio: "Hadi Mobarra", looking: "دنبال چه هستم", lookingItems: ["نقش فرانت‌اند دورکار، تمام‌وقت یا پروژه‌ای.", "محصولاتی که سختی‌شان داده است: کاتالوگ، پایپ‌لاین، داشبورد و پنل مدیریت.", "تیم‌هایی که ناهمگام کار می‌کنند و کد یکدیگر را بازبینی می‌کنند."], help: "بیشترین کمک من", not: "چه زمانی احتمالاً گزینه مناسبی نیستم", notItems: ["به بک‌اند، موبایل بومی یا طراحی برند نیاز دارید. تجربه عملیاتی من فرانت‌اند با React و TypeScript است.", "به حضور فیزیکی نیاز دارید. من از تهران (UTC+3:30) کار می‌کنم.", "به بیش از حدود چهار سال تجربه حرفه‌ای نیاز دارید."], check: "پیش از نوشتن", checks: [["مقایسه آگهی شغلی با کاتالوگ من", "/fit/"], ["دیدن سند هر ادعا", "/catalog/"], ["خواندن رزومه", "/resume/"], ["دیدن اشتباه‌های من", "/corrections/"]] as [string, string][], next: "گام بعد", ask: "پرسش عمومی از من", contact: "نوشتن به من" },
};
export const hireMetadata = meta(hireCopy, "/hire/");

export function HirePage({ locale }: { locale: Locale }) {
  const t = hireCopy[locale];
  const { hire } = getDictionary(locale);
  const { booking, email, repository } = siteConfig.links;
  const list = (items: string[]) => <ul className="space-y-2.5 list-disc ps-5 marker:text-primary leading-relaxed">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
  const h2 = "text-xl font-bold tracking-tight mb-4";
  return (
    <PageShell title={t.title} intro={t.intro}>
      <div className="space-y-12">
        <section><h2 className={h2}>{t.looking}</h2>{list(t.lookingItems)}</section>
        <section><h2 className={h2}>{t.help}</h2>{list(hire.help)}</section>
        <section><h2 className={h2}>{t.not}</h2>{list(t.notItems)}</section>
        <section><h2 className={h2}>{t.check}</h2><ul className="space-y-2">{t.checks.map(([label, path]) => <li key={path}><Link href={localePath(locale, path)} className={textLink}>{label}</Link></li>)}</ul></section>
        <section><h2 className={h2}>{t.pronounce}</h2><p>{t.sayIt} <span className="text-muted">(<bdi>{t.audio}</bdi>)</span></p></section>
        <section>
          <h2 className={h2}>{t.next}</h2>
          <p className="flex flex-wrap gap-3">
            <a href={booking || `mailto:${email}?subject=${encodeURIComponent(hire.bookSubject)}&body=${encodeURIComponent(hire.bookBody)}`} data-track="book-call" className="btn-gradient inline-flex items-center h-11 px-6 rounded-full text-sm font-semibold">{booking ? hire.book : hire.bookEmail}</a>
            <a href={`https://github.com/${repository}/discussions/new?category=q-a`} data-track="ask-public" className="inline-flex items-center h-11 px-6 rounded-full border border-border bg-card text-sm font-semibold">{t.ask}</a>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
