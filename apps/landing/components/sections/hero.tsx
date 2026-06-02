"use client";

import { motion } from "framer-motion";
import { Download, Mail, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Typewriter } from "@/components/shared/typewriter";
import { FloatingIcons } from "@/components/shared/floating-icons";
import { ScrollIndicator } from "@/components/shared/scroll-indicator";
import { Avatar } from "@/components/ui/avatar";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg"
    >
      <FloatingIcons />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Avatar
            src="/images/profile.jpeg"
            size="xl"
            alt="Hadi Mobarra"
            className="mb-8 ring-4 ring-border shadow-xl"
            fallback="HM"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-sm md:text-base font-medium text-primary mb-4 tracking-wider uppercase">
            {t("hero.greeting")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            {t("hero.name")}
          </h1>
          <div className="text-xl sm:text-2xl md:text-3xl text-muted h-10 mb-6">
            <Typewriter />
          </div>
          <p className="text-base md:text-lg text-muted max-w-2xl mb-10 leading-relaxed">
            {t("hero.description")}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full text-base font-medium bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <Mail size={18} />
            {t("hero.contactMe")}
          </a>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full text-base font-medium bg-background text-foreground border border-border hover:border-primary/30 hover:bg-surface hover:shadow-sm transition-all duration-300"
          >
            <Download size={18} />
            {t("hero.downloadResume")}
          </a>
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full text-base font-medium text-foreground hover:bg-surface transition-all duration-300"
          >
            {t("hero.viewProjects")}
            <ArrowDown size={18} />
          </a>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
