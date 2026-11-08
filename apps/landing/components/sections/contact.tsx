"use client";

import { useRef, useState } from "react";
import { Send, Mail, MapPin, Phone, Check, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { SpotlightCard } from "@/components/shared/spotlight-card";
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

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = `${t("contact.form.subjectPrefix")} ${String(formData.get("subject") || "").trim()}`;
    const message = String(formData.get("message") || "").trim();

    // Fallback: open the visitor's mail client with everything pre-filled.
    const mailtoHref = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `${message}\n\n— ${name} <${email}>`
    )}`;
    const fail = (reason?: string) => {
      setStatus("error");
      toast.error(t("contact.form.errorTitle"), {
        description: reason || t("contact.form.errorText"),
        action: { label: t("contact.form.emailInstead"), onClick: () => (window.location.href = mailtoHref) },
        duration: 10000,
      });
      window.setTimeout(() => setStatus("idle"), 5000);
    };

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      fail();
      return;
    }

    const payload = {
      access_key: accessKey,
      subject,
      from_name: name,
      email,
      message,
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
      toast.success(t("contact.form.sentText"));
      formRef.current?.reset();
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      fail(err instanceof Error && err.message !== "failed" ? err.message : undefined);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: siteConfig.links.email, href: `mailto:${siteConfig.links.email}`, copy: true },
    { icon: Phone, label: t("contact.phone"), value: t("contact.phoneValue"), href: `tel:${siteConfig.links.phone}`, copy: true },
    { icon: MapPin, label: t("contact.location"), value: t("contact.locationValue") },
  ];

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("contact.copied"));
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

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
      className="bg-surface/60"
    >
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <AnimatedElement direction="left" className="lg:col-span-2 space-y-6">
          <p className="text-muted leading-relaxed">{t("contact.description")}</p>
          <div className="space-y-3">
            {contactInfo.map((info) => (
              <SpotlightCard key={info.label} className="flex items-center gap-4 p-4 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-violet/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <info.icon size={18} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="text-sm font-medium hover:text-primary transition-colors break-all" dir="ltr">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{info.value}</p>
                  )}
                </div>
                {info.copy && (
                  <button
                    type="button"
                    onClick={() => copy(info.value)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 opacity-60 group-hover:opacity-100 transition-all"
                    aria-label={`Copy ${info.label}`}
                  >
                    <Copy size={14} />
                  </button>
                )}
              </SpotlightCard>
            ))}
          </div>
        </AnimatedElement>

        <AnimatedElement direction="right" delay={0.2} className="lg:col-span-3">
          <form ref={formRef} onSubmit={handleSubmit} className="glass-card border-beam rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5">
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
              variant="gradient"
              className="w-full"
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
