"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { siteConfig } from "@/lib/site";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; mailto: string };

export interface ContactFormLabels {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  subjectPrefix: string;
  errorTitle: string;
  errorText: string;
  emailInstead: string;
  sentTitle: string;
  sentText: string;
}

const field =
  "w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    if (get("botcheck")) return; // filled in by bots only

    const subject = `${labels.subjectPrefix} ${get("subject")}`;
    const message = get("message");
    const fail = () =>
      setStatus({
        kind: "error",
        // Fallback: the visitor's mail client with everything pre-filled
        mailto: `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n— ${get("name")} <${get("email")}>`)}`,
      });

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) return fail();

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: accessKey, subject, from_name: get("name"), email: get("email"), message, site: siteConfig.url }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) return fail();
      form.reset();
      setStatus({ kind: "sent" });
      window.dispatchEvent(new CustomEvent("analytics", { detail: "contact-sent" }));
    } catch {
      fail();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/5">
      <fieldset disabled={sending} className="contents">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input name="name" aria-label={labels.name} placeholder={labels.name} autoComplete="name" required className={`${field} h-12`} />
          <input name="email" type="email" aria-label={labels.email} placeholder={labels.email} autoComplete="email" required className={`${field} h-12`} />
        </div>
        <input name="subject" aria-label={labels.subject} placeholder={labels.subject} required className={`${field} h-12 mb-4`} />
        <textarea name="message" aria-label={labels.message} placeholder={labels.message} rows={5} required className={`${field} min-h-[140px] py-3 mb-5 resize-y block`} />
        <input type="text" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
        <button type="submit" className="btn-gradient w-full h-13 rounded-full text-base font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60">
          <Send size={18} className="rtl:-scale-x-100" />
          {sending ? labels.sending : labels.send}
        </button>
      </fieldset>
      <div aria-live="polite">
        {status.kind === "sent" && (
          <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
            <strong>{labels.sentTitle}.</strong> {labels.sentText}
          </p>
        )}
        {status.kind === "error" && (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm">
            <strong>{labels.errorTitle}.</strong> {labels.errorText}{" "}
            <a href={status.mailto} className="font-semibold text-primary underline underline-offset-2">
              {labels.emailInstead}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
