import { Award, Briefcase, Code, GitMerge, GraduationCap, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import type { Dictionary } from "@/lib/dictionary";
import { formatNumber } from "@/lib/format";
import { trustCounts } from "@/content/catalog";
import { github, mergedPullRequests } from "@/lib/github";
import type { Locale } from "@/lib/locale";

export function About({ locale, t }: { locale: Locale; t: Dictionary }) {
  const n = (value: number) => formatNumber(value, locale);
  const stats = [
    { icon: Code, value: n(trustCounts.public), label: t.about.stats.projects, tint: "from-primary/15 to-primary/5 text-primary" },
    { icon: Briefcase, value: n(mergedPullRequests.length), label: t.about.stats.technologies, tint: "from-violet/15 to-violet/5 text-violet" },
    { icon: Award, value: `${n(4)}+`, label: t.about.stats.experience, tint: "from-secondary/15 to-secondary/5 text-secondary" },
    { icon: GitMerge, value: n(Object.keys(github.repos).length), label: t.about.stats.contributions, tint: "from-accent/15 to-accent/5 text-accent" },
  ];

  return (
    <SectionWrapper id="about" eyebrow={t.eyebrows.about} title={t.about.title} subtitle={t.about.subtitle}>
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        <div className="reveal">
          <div className="space-y-5 [&_strong]:text-foreground [&_strong]:font-semibold">
            {[t.about.para1, t.about.para2, t.about.para3].map((html) => (
              <p key={html} className="text-base md:text-lg text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-xs font-medium">
              <GraduationCap size={14} className="text-primary" /> {t.education.items[0].degree}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-xs font-medium">
              <MapPin size={14} className="text-primary" /> {t.contact.locationValue}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <SpotlightCard key={stat.label} className="reveal p-6 flex flex-col">
              <div aria-hidden className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.tint} flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <dt className="order-2 text-sm text-muted mt-1.5">{stat.label}</dt>
              <dd className="order-1 text-4xl font-bold tracking-tight gradient-text">{stat.value}</dd>
            </SpotlightCard>
          ))}
        </dl>
      </div>
    </SectionWrapper>
  );
}
