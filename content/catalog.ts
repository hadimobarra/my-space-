import type { Locale } from "@/lib/locale";

type Text = Record<Locale, string>;

/** public: anyone can check it. colleague: a published recommendation says so. self: only my word. */
export type Trust = "public" | "colleague" | "self";
export type Kind = "openSource" | "work" | "craft" | "education";

export interface Claim {
  id: string;
  kind: Kind;
  trust: Trust;
  text: Text;
  when: Text;
  skills: string[];
  proofs: { label: Text; href: string }[];
}

const t = (en: string, fa: string): Text => ({ en, fa });
const pr = (repo: string, n: number) => ({ label: t(`Pull request #${n}`, `درخواست ادغام #${n}`), href: `https://github.com/${repo}/pull/${n}` });
const article = (slug: string) => ({ label: t("Article", "مقاله"), href: `/blog/${slug}/` });
const caseStudy = (slug: string) => ({ label: t("Case study", "مطالعه موردی"), href: `/projects/${slug}/` });
const source = (path: string, en: string, fa: string) => ({ label: t(en, fa), href: `https://github.com/hadimobarra/my-space-/blob/main/${path}` });
const recommendation = { label: t("Mehdi Alemi's recommendation", "توصیه‌نامه مهدی عالمی"), href: "/#testimonials" };
const present = t("Apr 2023 – present", "فروردین ۱۴۰۲ تا اکنون");

export const claims: Claim[] = [
  { id: "superset-safari", kind: "openSource", trust: "public", when: t("Oct 2026", "مهر ۱۴۰۵"), skills: ["React", "TypeScript", "Jest", "WebGL", "Open source", "Apache Superset"],
    text: t("Fixed blank chart and dashboard image exports on Safari in Apache Superset.", "رفع خالی بودن خروجی تصویر نمودار و داشبورد در Safari برای Apache Superset."),
    proofs: [pr("apache/superset", 44529), caseStudy("superset-safari-export"), article("safari-blank-chart-exports")] },
  { id: "openmetadata-diffs", kind: "openSource", trust: "public", when: t("Nov 2026", "آبان ۱۴۰۵"), skills: ["React", "TypeScript", "Jest", "Open source", "OpenMetadata"],
    text: t("Stopped malformed data from crashing version pages in OpenMetadata, and fixed two display bugs on the way.", "جلوگیری از کرش صفحات نسخه OpenMetadata با داده معیوب و رفع دو باگ نمایش در مسیر."),
    proofs: [pr("open-metadata/OpenMetadata", 33580), caseStudy("openmetadata"), article("never-trust-json-parse-in-render")] },
  { id: "superset-explore", kind: "openSource", trust: "public", when: t("In review", "در حال بازبینی"), skills: ["React", "TypeScript", "Open source", "Apache Superset"],
    text: t("Two further Explore fixes for Superset are open and waiting for review.", "دو اصلاح دیگر برای Explore در Superset باز و در انتظار بازبینی است."),
    proofs: [pr("apache/superset", 46105), pr("apache/superset", 45168)] },
  { id: "adin", kind: "work", trust: "colleague", when: present, skills: ["React", "JavaScript", "TypeScript"],
    text: t("Front-end engineer at Adin, on a data governance and ETL platform.", "مهندس فرانت‌اند در آدین، روی پلتفرم حاکمیت داده و ETL."), proofs: [recommendation] },
  { id: "adin-openmetadata", kind: "work", trust: "colleague", when: present, skills: ["React", "OpenMetadata"],
    text: t("Played a pivotal role in developing Adin's OpenMetadata-based platform.", "نقش کلیدی در توسعه پلتفرم مبتنی بر OpenMetadata در آدین."), proofs: [recommendation, caseStudy("openmetadata")] },
  { id: "uploads", kind: "work", trust: "self", when: present, skills: ["React", "TypeScript", "Uppy.js", "TUS"],
    text: t("Architected a resumable multi-GB upload module. The product is private; the demo shows the same protocol.", "معماری ماژول آپلود ازسرگیری‌پذیر چند گیگابایتی. محصول خصوصی است؛ دمو همان پروتکل را نشان می‌دهد."),
    proofs: [{ label: t("Live demo", "دموی زنده"), href: "/projects/resumable-uploads/#demo" }, article("resumable-uploads-tus")] },
  { id: "pipeline-editor", kind: "work", trust: "self", when: present, skills: ["React", "TypeScript", "Ant Design", "ETL", "YAML"],
    text: t("Built an ETL pipeline editor with live YAML preview, and owned the Add Pipeline page end to end.", "ساخت ویرایشگر پایپ‌لاین ETL با پیش‌نمایش زنده YAML و مالکیت کامل صفحه Add Pipeline."), proofs: [caseStudy("openmetadata")] },
  { id: "data-catalog", kind: "work", trust: "self", when: present, skills: ["React", "TypeScript", "Ant Design", "Zustand", "Data catalog"],
    text: t("Built the data catalog, Mapping Table and Mapping Column interfaces.", "ساخت رابط‌های کاتالوگ داده، Mapping Table و Mapping Column."), proofs: [caseStudy("data-catalog")] },
  { id: "roles", kind: "work", trust: "self", when: present, skills: ["React", "TypeScript", "Access control"],
    text: t("Replaced a static permission model with dynamic, fine-grained role management, and built a glossary approval workflow with an audit trail.", "جایگزینی مدل دسترسی ایستا با مدیریت نقش پویا و ریزدانه و ساخت گردش‌کار تأیید واژه‌نامه با سابقه ممیزی."), proofs: [caseStudy("data-catalog")] },
  { id: "rtl", kind: "work", trust: "self", when: present, skills: ["RTL", "i18n", "i18next", "CSS"],
    text: t("Led full Persian (RTL) localization of the product. This bilingual site is the public sample.", "رهبری بومی‌سازی کامل فارسی (RTL) محصول. این سایت دوزبانه نمونه عمومی آن است."),
    proofs: [{ label: t("This catalog in Persian", "همین کاتالوگ به فارسی"), href: "/fa/catalog/" }, article("rtl-is-not-a-translation-step")] },
  { id: "schema-i18n", kind: "work", trust: "self", when: present, skills: ["i18n", "JSON Schema", "TypeScript"],
    text: t("Built translation tooling for forms generated from JSON Schema.", "ساخت ابزار ترجمه برای فرم‌های تولیدشده از JSON Schema."), proofs: [article("translating-json-schema-forms")] },
  { id: "mci", kind: "work", trust: "self", when: t("Nov 2022 – Apr 2023", "آبان ۱۴۰۱ تا فروردین ۱۴۰۲"), skills: ["React", "Redux", "Redux Saga", "Material UI", "Sass", "Webpack", "Docker", "Nginx"],
    text: t("Built features for production telecom dashboards at MCI (graduate internship).", "ساخت قابلیت برای داشبوردهای مخابراتی همراه اول (کارآموزی تحصیلات تکمیلی)."), proofs: [] },
  { id: "this-site", kind: "craft", trust: "public", when: t("Nov 2026", "آذر ۱۴۰۵"), skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Server components"],
    text: t("Rebuilt this site with 45% less homepage JavaScript and two indexable languages.", "بازسازی این سایت با ۴۵٪ جاوااسکریپت کمتر در صفحه اصلی و دو زبان قابل ایندکس."), proofs: [caseStudy("this-website"), { label: t("Source code", "کد منبع"), href: "https://github.com/hadimobarra/my-space-" }] },
  { id: "testing", kind: "craft", trust: "public", when: t("Nov 2026", "آذر ۱۴۰۵"), skills: ["Playwright", "Accessibility", "Performance", "GitHub Actions", "CI/CD", "Testing"],
    text: t("Every deploy has to pass browser tests, accessibility checks in both themes and a JavaScript budget.", "هر انتشار باید از تست مرورگر، بررسی دسترس‌پذیری در دو تم و سقف حجم جاوااسکریپت عبور کند."),
    proofs: [source(".github/workflows/ci.yml", "Workflow", "گردش‌کار"), source("tests", "Tests", "تست‌ها")] },
  { id: "writing", kind: "craft", trust: "public", when: t("Since 2026", "از ۲۰۲۶"), skills: ["Technical writing"],
    text: t("Writes about front-end engineering, with interactive demos. How AI is used is documented.", "نوشتن درباره مهندسی فرانت‌اند با دموهای تعاملی. شیوه استفاده از هوش مصنوعی مستند است."),
    proofs: [{ label: t("All articles", "همه مقاله‌ها"), href: "/blog/" }, { label: t("How I use AI", "استفاده من از هوش مصنوعی"), href: "/ai/" }] },
  { id: "teamwork", kind: "work", trust: "colleague", when: present, skills: ["Communication", "Teamwork", "Code review"],
    text: t("Communicates well, helps colleagues and cares about details, according to two people who worked with me.", "ارتباط خوب، کمک به همکاران و توجه به جزئیات، به گفته دو نفر از همکارانم."),
    proofs: [{ label: t("Both recommendations", "هر دو توصیه‌نامه"), href: "/#testimonials" }] },
  { id: "msc", kind: "education", trust: "self", when: t("2022 – 2024", "۱۴۰۱ تا ۱۴۰۳"), skills: ["Distributed systems"],
    text: t("M.Sc. in Computer Engineering, Iran University of Science and Technology.", "کارشناسی ارشد مهندسی کامپیوتر، دانشگاه علم و صنعت ایران."), proofs: [] },
  { id: "bsc", kind: "education", trust: "self", when: t("2017 – 2021", "۱۳۹۶ تا ۱۴۰۰"), skills: ["Computer science"],
    text: t("B.Sc. in Computer Engineering, University of Mohaghegh Ardabili.", "کارشناسی مهندسی کامپیوتر، دانشگاه محقق اردبیلی."), proofs: [] },
  { id: "elite", kind: "education", trust: "self", when: t("2022", "۱۴۰۱"), skills: [],
    text: t("Member of Iran's National Elite Foundation.", "عضو بنیاد ملی نخبگان."), proofs: [] },
];

export const trustCounts = claims.reduce((n, c) => ({ ...n, [c.trust]: n[c.trust] + 1 }), { public: 0, colleague: 0, self: 0 } as Record<Trust, number>);

const order: Trust[] = ["public", "colleague", "self"];

/** Every skill with its best-supported trust label and the claims behind it. */
export function skillIndex(locale: Locale) {
  const skills = new Map<string, { name: string; trust: Trust; claims: { id: string; text: string }[] }>();
  for (const claim of claims) {
    for (const name of claim.skills) {
      const entry = skills.get(name) ?? { name, trust: claim.trust, claims: [] };
      if (order.indexOf(claim.trust) < order.indexOf(entry.trust)) entry.trust = claim.trust;
      entry.claims.push({ id: claim.id, text: claim.text[locale] });
      skills.set(name, entry);
    }
  }
  return [...skills.values()];
}
