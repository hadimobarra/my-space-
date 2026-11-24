import { BadgeCheck, MessageSquareQuote, UserRound } from "lucide-react";
import type { Trust } from "@/content/catalog";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export const trustLabels: Record<Trust, Record<Locale, string>> = {
  public: { en: "Public proof", fa: "سند عمومی" },
  colleague: { en: "Confirmed by a colleague", fa: "تأیید همکار" },
  self: { en: "My word", fa: "گفته خودم" },
};

const style = {
  public: { Icon: BadgeCheck, className: "bg-accent/10 text-[#046c4e] dark:text-accent" },
  colleague: { Icon: MessageSquareQuote, className: "bg-primary/10 text-primary-dark dark:text-primary" },
  self: { Icon: UserRound, className: "bg-surface-alt text-muted" },
};

export function TrustBadge({ trust, locale }: { trust: Trust; locale: Locale }) {
  const { Icon, className } = style[trust];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap", className)}>
      <Icon size={13} aria-hidden /> {trustLabels[trust][locale]}
    </span>
  );
}
