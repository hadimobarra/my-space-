import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown, FileText, Mail, Sparkles } from "lucide-react";
import { Avatar } from "@/components/shared/avatar";
import { BrandIcon } from "@/components/shared/brand-icon";
import { socialLinks } from "@/components/layout/footer";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";

const orbitIcons = ["React", "TypeScript", "Next.js", "JavaScript (ES2024)", "Tailwind CSS", "Redux"];

export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { hero } = t;
  return (
    <section id="hero" className="spotlight-area relative min-h-screen flex items-center overflow-hidden noise pt-28 pb-20 section-padding">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-wide w-full grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-10 items-center">
        <div className="text-center lg:text-start">
          <p className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-border bg-card/70 text-xs font-medium text-muted shadow-sm">
            <span aria-hidden className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping-slow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {hero.available}
          </p>

          <h1>
            <span className="block text-sm md:text-base font-medium text-primary mb-3 tracking-[0.2em] uppercase">{hero.greeting}</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] mb-6 pb-1 gradient-text animate-rise">
              {hero.name}
            </span>
          </h1>

          {/* Sighted users see one role at a time; everyone else gets the whole list. */}
          <p className="sr-only">{hero.roles.join(", ")}</p>
          <div aria-hidden className="role-rotator text-xl sm:text-2xl md:text-3xl font-semibold mb-6" style={{ "--roles": hero.roles.length } as CSSProperties}>
            <div>
              {[...hero.roles, hero.roles[0]].map((role, i) => (
                <span key={i} className="gradient-text">{role}</span>
              ))}
            </div>
          </div>

          <p className="text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">{hero.description}</p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="#contact" data-track="hero-contact" className="btn-gradient inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold hover:-translate-y-0.5">
              <Mail size={17} />
              {hero.contactMe}
            </a>
            <a href="#projects" className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold border border-border bg-card/60 hover:border-primary/40 hover:bg-card transition-colors">
              {hero.viewProjects}
              <ArrowDown size={17} />
            </a>
            <Link href={localePath(locale, "/resume/")} data-track="resume-view" className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full text-sm font-medium text-muted hover:text-foreground transition-colors">
              <FileText size={16} />
              {hero.resume}
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-3">
            {socialLinks.map(({ href, Icon, label }) => (
              <a key={label} href={href} rel="noopener noreferrer" aria-label={label} data-track={label.toLowerCase()} className="w-10 h-10 rounded-full border border-border bg-card/60 flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div dir="ltr" className="relative mx-auto w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]">
          <div aria-hidden className="absolute inset-0 rounded-full border border-dashed border-border" />
          <div aria-hidden className="absolute inset-[14%] rounded-full border border-border/70" />

          {/* The ring rotates; each icon counter-rotates to stay upright. */}
          <div aria-hidden className="absolute inset-0 animate-[spin_40s_linear_infinite]">
            {orbitIcons.map((name, i) => {
              const rad = (i * 60 * Math.PI) / 180;
              return (
                <div
                  key={name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(50 + 50 * Math.sin(rad)).toFixed(2)}%`, top: `${(50 - 50 * Math.cos(rad)).toFixed(2)}%` }}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                    <BrandIcon name={name} size={22} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-[24%] rounded-full border-beam p-1.5 shadow-2xl shadow-primary/20">
            <Avatar large alt={hero.name} className="w-full h-full ring-4 ring-background" />
          </div>

          <div dir="auto" className="absolute -left-4 sm:-left-10 top-[18%] bg-card border border-border rounded-2xl px-4 py-3 shadow-xl hidden sm:block">
            <p className="text-2xl font-bold gradient-text">4+</p>
            <p className="text-[11px] text-muted font-medium">{hero.chipYears}</p>
          </div>
          <div className="absolute -right-2 sm:-right-8 bottom-[14%] bg-card border border-border rounded-2xl px-4 py-3 shadow-xl hidden sm:flex items-center gap-2.5">
            <span aria-hidden className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </span>
            <span>
              <span className="block text-xs font-semibold">Apache Superset</span>
              <span className="block text-[11px] text-muted">{hero.chipOss}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
