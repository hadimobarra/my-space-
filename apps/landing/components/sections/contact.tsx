"use client";

import { useRef, useState } from "react";
import { Send, Mail, MapPin, Phone, Check, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/seo";

type ContactStatus = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      access_key: accessKey,
      subject: `${t("contact.form.subjectPrefix")} ${String(formData.get("subject") || "").trim()}`,
      from_name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      site: siteConfig.url,
    };

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "failed");
      }
      setStatus("sent");
      formRef.current?.reset();
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: siteConfig.links.email },
    { icon: MapPin, label: t("contact.location"), value: t("contact.locationValue") },
    { icon: Phone, label: t("contact.phone"), value: t("contact.phoneValue") },
  ];

  const isSending = status === "sending";
  const buttonLabel =
    status === "sent"
      ? t("contact.form.sent")
      : status === "error"
      ? t("contact.form.error")
      : isSending
      ? t("contact.form.sending")
      : t("contact.form.send");

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
          <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                name="name"
                aria-label={t("contact.form.name")}
                placeholder={t("contact.form.name")}
                autoComplete="name"
                disabled={isSending}
                required
              />
              <Input
                name="email"
                type="email"
                aria-label={t("contact.form.email")}
                placeholder={t("contact.form.email")}
                autoComplete="email"
                disabled={isSending}
                required
              />
            </div>
            <Input
              name="subject"
              aria-label={t("contact.form.subject")}
              placeholder={t("contact.form.subject")}
              className="mb-4"
              disabled={isSending}
              required
            />
            <Textarea
              name="message"
              aria-label={t("contact.form.message")}
              placeholder={t("contact.form.message")}
              rows={5}
              className="mb-5"
              disabled={isSending}
              required
            />
            <input
              type="text"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white"
              disabled={isSending}
            >
              {status === "sent" ? (
                <>
                  <Check size={18} />
                  {buttonLabel}
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle size={18} />
                  {buttonLabel}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {buttonLabel}
                </>
              )}
            </Button>
          </form>
        </AnimatedElement>
      </div>
    </SectionWrapper>
  );
}
