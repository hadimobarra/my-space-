import Link from "next/link";
import { CalendarClock, Check, Clock, Copy, FileText, Mail, MapPin } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";
import { ContactForm } from "./contact-form";
import { Overlap } from "./overlap";

export function Contact({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { contact, hire } = t;
  const { email, booking } = siteConfig.links;
  const bookingHref = booking || `mailto:${email}?subject=${encodeURIComponent(hire.bookSubject)}&body=${encodeURIComponent(hire.bookBody)}`;
  const iconBox = "w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-violet/10 flex items-center justify-center shrink-0";

  return (
    <SectionWrapper id="contact" eyebrow={t.eyebrows.contact} title={contact.title} subtitle={contact.subtitle}>
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-1">{hire.title}</h3>
          <p className="text-sm text-muted mb-6">{hire.availability}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            <a href={bookingHref} data-track="book-call" className="btn-gradient inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold">
              <CalendarClock size={16} />
              {booking ? hire.book : hire.bookEmail}
            </a>
            <Link href={localePath(locale, "/resume/")} data-track="resume-view" className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary/40 transition-colors">
              <FileText size={16} />
              {hire.resume}
            </Link>
          </div>

          <ul className="space-y-5 mb-8 text-sm">
            <li className="flex items-center gap-4">
              <span aria-hidden className={iconBox}><Mail size={18} className="text-primary" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">{contact.email}</p>
                <div className="flex items-center gap-2">
                  <a href={`mailto:${email}`} dir="ltr" data-track="email" className="font-medium hover:text-primary transition-colors break-all">{email}</a>
                  <CopyButton value={email} label={contact.copyLabel} copiedLabel={contact.copied} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors shrink-0">
                    <Copy size={14} />
                  </CopyButton>
                </div>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span aria-hidden className={iconBox}><MapPin size={18} className="text-primary" /></span>
              <div>
                <p className="text-xs text-muted">{contact.location}</p>
                <p className="font-medium">{contact.locationValue}</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span aria-hidden className={iconBox}><Clock size={18} className="text-primary" /></span>
              <div>
                <p className="text-xs text-muted">{hire.hours}</p>
                <div>
                  <span className="font-medium">{hire.hoursValue}</span>
                  <span className="block text-muted min-h-10"><Overlap locale={locale} labels={{ yourTime: hire.yourTime, overlap: hire.overlap, sameZone: hire.sameZone, noOverlap: hire.noOverlap }} /></span>
                </div>
              </div>
            </li>
          </ul>

          <h3 className="text-sm font-semibold mb-3">{hire.helpTitle}</h3>
          <ul className="space-y-2">
            {hire.help.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                <Check size={16} aria-hidden className="text-accent mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-muted leading-relaxed mb-6">{contact.description}</p>
          <ContactForm labels={contact.form} />
        </div>
      </div>
    </SectionWrapper>
  );
}
