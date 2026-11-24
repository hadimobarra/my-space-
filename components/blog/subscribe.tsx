import { Rss } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

/** Email form (when a newsletter account is configured) and the RSS link. */
export function Subscribe({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-6">
      {siteConfig.newsletter && (
        <form
          action={`https://buttondown.com/api/emails/embed-subscribe/${siteConfig.newsletter}`}
          method="post"
          className="w-full max-w-md glass-card rounded-2xl p-6 text-center"
        >
          <p className="font-semibold">{t.blog.subscribeTitle}</p>
          <p className="text-sm text-muted mb-4">{t.blog.subscribeText}</p>
          <div className="flex gap-2">
            <input type="email" name="email" required aria-label={t.blog.emailLabel} placeholder={t.blog.emailLabel} className="flex-1 min-w-0 h-11 rounded-full border border-border bg-background px-4 text-sm placeholder:text-muted" />
            <button type="submit" data-track="subscribe" className="btn-gradient h-11 px-5 rounded-full text-sm font-semibold">{t.blog.subscribeButton}</button>
          </div>
        </form>
      )}
      <a href={localePath(locale, "/rss.xml")} data-track="rss" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-medium text-muted hover:text-primary hover:border-primary/30 transition-colors">
        <Rss size={13} /> {t.blog.subscribe}
      </a>
    </div>
  );
}
