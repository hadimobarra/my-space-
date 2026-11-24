import { Rss } from "lucide-react";
import { PageShell, textLink } from "@/components/site/page-shell";
import { WeeksChart } from "@/components/site/weeks-chart";
import glossary from "@/content/glossary.json";
import { formatDate, formatMonth, formatNumber } from "@/lib/format";
import { localePath, type Locale } from "@/lib/locale";
import { renderMdxToHtml } from "@/lib/mdx";
import { getNotes } from "@/lib/notes";
import { pageMetadata } from "@/lib/seo";

const meta = (copy: Record<Locale, { title: string; description: string }>, path: string) => (locale: Locale) =>
  pageMetadata({ locale, path, title: copy[locale].title, description: copy[locale].description });

// ───────────────────────── Notes

const notesCopy = {
  en: { title: "Notes", description: "Short notes on front-end engineering, right-to-left interfaces and data tools.", intro: "Short and unpolished: one thing I found out, usually with a link.", rss: "RSS for notes" },
  fa: { title: "یادداشت‌ها", description: "یادداشت‌های کوتاه درباره فرانت‌اند، رابط راست‌به‌چپ و ابزارهای داده.", intro: "کوتاه و بی‌تکلف: یک چیز که فهمیدم، معمولاً با یک پیوند.", rss: "RSS یادداشت‌ها" },
};
export const notesMetadata = meta(notesCopy, "/notes/");

export async function NotesPage({ locale }: { locale: Locale }) {
  const t = notesCopy[locale];
  const notes = await Promise.all(getNotes(locale).map(async (n) => ({ ...n, html: await renderMdxToHtml(n.content) })));
  return (
    <PageShell title={t.title} intro={<p>{t.intro} <a href={localePath(locale, "/notes/rss.xml")} className={`${textLink} inline-flex items-center gap-1.5 text-sm`}><Rss size={14} aria-hidden /> {t.rss}</a></p>}>
      <div className="space-y-14" data-pagefind-body>
        {notes.map((n) => (
          <article key={n.id} id={n.id} className="scroll-mt-28">
            <h2 className="text-xl font-bold tracking-tight mb-1"><a href={`#${n.id}`} className="hover:text-primary">{n.title}</a></h2>
            <time dateTime={n.date} className="text-xs text-muted">{formatDate(n.date, locale)}</time>
            <div className="prose-article mt-4" dangerouslySetInnerHTML={{ __html: n.html }} />
          </article>
        ))}
      </div>
    </PageShell>
  );
}

// ───────────────────────── Glossary

const glossaryCopy = {
  en: { title: "Persian data glossary", description: "English data and analytics terms in Persian, next to what Apache Superset and OpenMetadata use today.", intro: "Data terms in Persian, next to what Apache Superset and OpenMetadata use today. Where they disagree, I suggest one term and use it on this site.", en: "English", fa: "Suggested Persian", count: "terms", source: "Product terms are taken from each project's Persian translation file, 24 November 2026." },
  fa: { title: "واژه‌نامه فارسی داده", description: "اصطلاحات داده و تحلیل به فارسی، در کنار آنچه Apache Superset و OpenMetadata امروز استفاده می‌کنند.", intro: "اصطلاحات داده به فارسی، در کنار آنچه Apache Superset و OpenMetadata امروز استفاده می‌کنند. جایی که اختلاف دارند یک واژه پیشنهاد می‌کنم.", en: "انگلیسی", fa: "پیشنهاد فارسی", count: "واژه", source: "واژه‌های محصولات از فایل ترجمه فارسی هر پروژه در ۳ آذر ۱۴۰۵ برداشته شده است." },
};
export const glossaryMetadata = meta(glossaryCopy, "/glossary/");

export function GlossaryPage({ locale }: { locale: Locale }) {
  const t = glossaryCopy[locale];
  const rows = [...glossary].sort((a, b) => a.en.localeCompare(b.en));
  return (
    <PageShell wide title={t.title} intro={<><p>{t.intro}</p><p className="mt-3 text-sm">{formatNumber(rows.length, locale)} {t.count}. {t.source}</p></>}>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={t.title}>
        <table className="w-full text-sm border-collapse" data-pagefind-body>
          <thead><tr>{[t.en, t.fa, "Apache Superset", "OpenMetadata"].map((h) => <th key={h} scope="col" className="text-start font-semibold border-b border-border py-3 pe-5">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.en} className="border-b border-border/60">
                <th scope="row" lang="en" dir="ltr" className="text-start font-medium py-3 pe-5">{r.en}</th>
                {[r.fa, r.superset, r.openmetadata].map((v, i) => <td key={i} lang="fa" dir="rtl" className={`text-right py-3 pe-5 ${i === 0 ? "font-semibold" : "text-muted"}`}>{v ?? "–"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

// ───────────────────────── Open questions

const questionsCopy = {
  en: { title: "Open questions", description: "What Hadi Mobarra doesn't know yet about RTL data tools, performance and testing.", intro: "Things I don't know yet. If you do, I'd like to hear it.", items: [
    ["Should time run right to left in a Persian chart?", "Text is mirrored without question. A time axis isn't: people who read Persian also read stock charts and scientific plots left to right. The only study I know tested tools and interviewed eleven Arabic-speaking practitioners, not readers of charts."],
    ["Persian or Latin digits in a data table?", "Persian digits read naturally. Latin digits can be copied into code, spreadsheets and other tools. Is a per-user setting the answer, or a way of avoiding one?"],
    ["How do you review thousands of machine translations?", "Large projects now fill gaps with machine translation and mark it for review. Nobody reads thousands of lines in a row. What order finds the worst ones first?"],
    ["What is left in blocking time?", "Less JavaScript didn't reduce it here, and neither did a shorter page. Is it mostly the framework starting up, and can a static site postpone that?"],
    ["How do you test an engine you don't have?", "I fixed a Safari bug without Safari. Is there an affordable way for contributors to check real rendering before review?"],
  ] as [string, string][] },
  fa: { title: "پرسش‌های باز", description: "آنچه هادی مبرا هنوز درباره ابزارهای داده راست‌به‌چپ، پرفورمنس و آزمون نمی‌داند.", intro: "چیزهایی که هنوز نمی‌دانم. اگر شما می‌دانید، خوشحال می‌شوم بشنوم.", items: [
    ["آیا زمان در نمودار فارسی باید از راست به چپ برود؟", "متن بی‌چون‌وچرا آینه می‌شود؛ محور زمان نه. فارسی‌زبانان نمودار بورس و نمودار علمی را چپ‌به‌راست هم می‌خوانند. تنها پژوهشی که می‌شناسم ابزارها را آزموده و با یازده متخصص عرب‌زبان گفت‌وگو کرده، نه با خوانندگان نمودار."],
    ["رقم فارسی یا لاتین در جدول داده؟", "رقم فارسی طبیعی خوانده می‌شود. رقم لاتین در کد، صفحه‌گسترده و ابزارهای دیگر کپی می‌شود. آیا تنظیم جداگانه برای هر کاربر پاسخ است یا فرار از پاسخ؟"],
    ["هزاران ترجمه ماشینی را چگونه باید بازبینی کرد؟", "پروژه‌های بزرگ جاهای خالی را با ترجمه ماشینی پر می‌کنند و برای بازبینی علامت می‌زنند. کسی هزاران سطر را پشت سر هم نمی‌خواند. چه ترتیبی بدترین‌ها را زودتر پیدا می‌کند؟"],
    ["از زمان مسدودی چه مانده است؟", "جاوااسکریپت کمتر اینجا آن را کم نکرد، صفحه کوتاه‌تر هم نه. آیا بیشترش راه‌اندازی فریم‌ورک است و سایت ایستا می‌تواند آن را به تعویق بیندازد؟"],
    ["موتوری را که ندارید چگونه می‌آزمایید؟", "باگی از Safari را بدون Safari رفع کردم. آیا راه ارزانی هست که مشارکت‌کننده پیش از بازبینی رندر واقعی را ببیند؟"],
  ] as [string, string][] },
};
export const questionsMetadata = meta(questionsCopy, "/questions/");

export function QuestionsPage({ locale }: { locale: Locale }) {
  const t = questionsCopy[locale];
  return (
    <PageShell title={t.title} intro={t.intro}>
      <div className="space-y-10">
        {t.items.map(([q, a]) => <section key={q}><h2 className="text-xl font-bold tracking-tight mb-2">{q}</h2><p className="text-muted leading-relaxed">{a}</p></section>)}
      </div>
    </PageShell>
  );
}

// ───────────────────────── Career in weeks

const weeksCopy = {
  en: { title: "My career in weeks", description: "One square per week since university, with the milestones that can be checked.", intro: "One square per week since I started university. Small squares are a second thing happening at the same time.", chart: "Weeks since October 2017, colored by what I was doing", milestones: "Milestones", phases: ["B.Sc.", "MCI internship", "Adin", "M.Sc. (alongside work)"], events: [["2017-10-01", "Started a B.Sc. in Computer Engineering", "/catalog/#bsc"], ["2022-10-01", "Started an M.Sc.", "/catalog/#msc"], ["2022-11-01", "First professional front-end work, at MCI", "/catalog/#mci"], ["2023-04-01", "Joined Adin", "/catalog/#adin"], ["2024-09-01", "Finished the M.Sc.", "/catalog/#msc"], ["2026-10-01", "First merge into Apache Superset", "/catalog/#superset-safari"], ["2026-11-16", "First merge into OpenMetadata", "/catalog/#openmetadata-diffs"], ["2026-11-24", "Rebuilt this site", "/catalog/#this-site"]] as [string, string, string][], month: "Dates before 2026 are known to the month." },
  fa: { title: "مسیر حرفه‌ای من به هفته", description: "هر مربع یک هفته از ورود به دانشگاه، همراه نقطه‌های عطف قابل بررسی.", intro: "هر مربع یک هفته از زمان ورود به دانشگاه است. مربع‌های کوچک کار دومی هستند که هم‌زمان انجام می‌شد.", chart: "هفته‌ها از مهر ۱۳۹۶ با رنگ فعالیت", milestones: "نقطه‌های عطف", phases: ["کارشناسی", "کارآموزی همراه اول", "آدین", "کارشناسی ارشد (هم‌زمان با کار)"], events: [["2017-10-01", "آغاز کارشناسی مهندسی کامپیوتر", "/catalog/#bsc"], ["2022-10-01", "آغاز کارشناسی ارشد", "/catalog/#msc"], ["2022-11-01", "نخستین کار حرفه‌ای فرانت‌اند در همراه اول", "/catalog/#mci"], ["2023-04-01", "پیوستن به آدین", "/catalog/#adin"], ["2024-09-01", "پایان کارشناسی ارشد", "/catalog/#msc"], ["2026-10-01", "نخستین ادغام در Apache Superset", "/catalog/#superset-safari"], ["2026-11-16", "نخستین ادغام در OpenMetadata", "/catalog/#openmetadata-diffs"], ["2026-11-24", "بازسازی این سایت", "/catalog/#this-site"]] as [string, string, string][], month: "تاریخ‌های پیش از ۲۰۲۶ در حد ماه مشخص‌اند." },
};
export const weeksMetadata = meta(weeksCopy, "/weeks/");

export function WeeksPage({ locale }: { locale: Locale }) {
  const t = weeksCopy[locale];
  const end = new Date().toISOString().slice(0, 10);
  const [bsc, mci, adin, msc] = t.phases;
  return (
    <PageShell wide title={t.title} intro={t.intro}>
      <WeeksChart locale={locale} label={t.chart} start="2017-10-01" end={end} phases={[
        { label: bsc, from: "2017-10-01", to: "2021-09-30", color: "#1fa3a0" },
        { label: mci, from: "2022-11-01", to: "2023-03-31", color: "#d8a53f" },
        { label: adin, from: "2023-04-01", to: end, color: "#2563eb" },
        { label: msc, from: "2022-10-01", to: "2024-09-30", color: "#7d332b", inset: true },
      ]} />
      <h2 className="text-2xl font-bold tracking-tight mt-16 mb-2">{t.milestones}</h2>
      <p className="text-sm text-muted mb-6">{t.month}</p>
      <ol className="space-y-3">
        {[...t.events].reverse().map(([date, label, href]) => (
          <li key={label} className="flex flex-wrap gap-x-5"><time dateTime={date} className="text-sm text-muted w-32 shrink-0">{date < "2026" ? formatMonth(date, locale) : formatDate(date, locale)}</time> <a href={localePath(locale, href)} className={textLink}>{label}</a></li>
        ))}
      </ol>
    </PageShell>
  );
}
