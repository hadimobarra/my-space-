"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/seo";

export function Contact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: siteConfig.links.email },
    { icon: MapPin, label: t("contact.location"), value: t("contact.locationValue") },
    { icon: Phone, label: t("contact.phone"), value: t("contact.phoneValue") },
  ];

  return (
    <SectionWrapper
      id="contact"
      title={t("contact.title")}
      subtitle={t("contact.subtitle")}
      className="bg-surface/50"
    >
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <AnimatedElement direction="left" className="lg:col-span-2 space-y-6">
          <p className="text-muted leading-relaxed">{t("contact.description")}</p>
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <info.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted">{info.label}</p>
                  <p className="text-sm font-medium">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedElement>

        <AnimatedElement direction="right" delay={0.2} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder={t("contact.form.name")}
                required
              />
              <Input
                type="email"
                placeholder={t("contact.form.email")}
                required
              />
            </div>
            <Input
              placeholder={t("contact.form.subject")}
              className="mb-4"
              required
            />
            <Textarea
              placeholder={t("contact.form.message")}
              rows={5}
              className="mb-5"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white"
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <Check size={18} />
                  {t("contact.form.sent")}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t("contact.form.send")}
                </>
              )}
            </Button>
          </form>
        </AnimatedElement>
      </div>
    </SectionWrapper>
  );
}
