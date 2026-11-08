"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Mail, ArrowDown, Download, Github, Linkedin, Sparkles } from "lucide-react";
import { SiReact, SiTypescript, SiNextdotjs, SiJavascript, SiTailwindcss, SiRedux } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { Typewriter } from "@/components/shared/typewriter";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import { TextReveal } from "@/components/shared/text-reveal";
import { Avatar } from "@/components/ui/avatar";
import { siteConfig } from "@/lib/seo";

const orbitIcons = [
  { Icon: SiReact, color: "#61DAFB", angle: 0 },
  { Icon: SiTypescript, color: "#3178C6", angle: 60 },
  { Icon: SiNextdotjs, color: "currentColor", angle: 120 },
  { Icon: SiJavascript, color: "#F7DF1E", angle: 180 },
  { Icon: SiTailwindcss, color: "#06B6D4", angle: 240 },
  { Icon: SiRedux, color: "#764ABC", angle: 300 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-following spotlight
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const spotlight = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(520px circle at ${x}px ${y}px, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)`
  );

  // Parallax as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMove}
      className="relative min-h-screen flex items-center overflow-hidden noise pt-24 pb-20 section-padding"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/25 blur-[120px] animate-aurora" />
        <div className="absolute top-1/4 -right-40 w-[32rem] h-[32rem] rounded-full bg-violet/20 blur-[120px] animate-aurora [animation-delay:-6s]" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-secondary/20 blur-[120px] animate-aurora [animation-delay:-12s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} />

      <div className="container-wide w-full grid lg:grid-cols-[1.15fr_1fr] gap-16 lg:gap-10 items-center">
        {/* Copy */}
        <motion.div style={{ y: contentY, opacity: fade }} className="text-center lg:text-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur text-xs font-medium text-muted shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping-slow" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("hero.available")}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-sm md:text-base font-medium text-primary mb-3 tracking-[0.2em] uppercase"
          >
            {t("hero.greeting")}
          </motion.p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] mb-6">
            <TextReveal text={t("hero.name")} delay={0.3} stagger={0.12} wordClassName="gradient-text-animated" />
          </h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground/90 h-10 mb-6 flex justify-center lg:justify-start"
          >
            <Typewriter />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.75}
            className="text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.9}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <a
              href="#contact"
              className="btn-gradient group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold hover:-translate-y-0.5"
            >
              <Mail size={17} className="transition-transform group-hover:-rotate-12" />
              {t("hero.contactMe")}
            </a>
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-semibold border border-border bg-card/60 backdrop-blur hover:border-primary/40 hover:bg-card transition-all"
            >
              {t("hero.viewProjects")}
              <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
              {t("hero.resume")}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1.05}
            className="mt-10 flex items-center justify-center lg:justify-start gap-3"
          >
            {[
              { href: siteConfig.links.github, Icon: Github, label: "GitHub" },
              { href: siteConfig.links.linkedin, Icon: Linkedin, label: "LinkedIn" },
              { href: `mailto:${siteConfig.links.email}`, Icon: Mail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-border bg-card/60 backdrop-blur flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px]"
        >
          {/* Orbit rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-border animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-[14%] rounded-full border border-border/70" />

          {/* Orbiting icons — the wrapper rotates, each icon counter-rotates to stay upright */}
          <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
            {orbitIcons.map(({ Icon, color, angle }) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <div
                  key={angle}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + 50 * Math.sin(rad)}%`, top: `${50 - 50 * Math.cos(rad)}%` }}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-strong shadow-lg flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                    <Icon size={22} style={{ color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Avatar with rotating conic ring */}
          <div className="absolute inset-[24%] rounded-full border-beam p-1.5 shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-violet/20 to-secondary/20 blur-2xl -z-10" />
            <Avatar
              src="/images/profile.jpeg"
              imageClassName="scale-[1.34]"
              size="xl"
              alt="Hadi Mobarra"
              className="w-full h-full ring-4 ring-background"
              fallback="HM"
            />
          </div>

          {/* Floating info chips */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 sm:-left-10 top-[18%] glass-strong rounded-2xl px-4 py-3 shadow-xl hidden sm:block"
          >
            <p className="text-2xl font-bold gradient-text">3+</p>
            <p className="text-[11px] text-muted font-medium">{t("hero.chipYears")}</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-2 sm:-right-8 bottom-[14%] glass-strong rounded-2xl px-4 py-3 shadow-xl hidden sm:flex items-center gap-2.5"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </span>
            <span>
              <p className="text-xs font-semibold">OpenMetadata</p>
              <p className="text-[11px] text-muted">{t("hero.chipOss")}</p>
            </span>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
