import type { Locale } from "@/lib/locale";

export interface Phase { label: string; from: string; to: string; color: string; inset?: boolean }

const WEEK = 7 * 864e5;

/** One square per week. Squares of a phase share one path, so ten years cost a handful of elements. */
export function WeeksChart({ phases, start, end, locale, label }: { phases: Phase[]; start: string; end: string; locale: Locale; label: string }) {
  const t0 = Date.parse(start);
  const total = Math.ceil((Date.parse(end) - t0) / WEEK);
  const square = (w: number, inset = false) => {
    const [offset, size] = inset ? [3, 4] : [0, 10];
    return `M${(w % 52) * 12 + offset} ${Math.floor(w / 52) * 12 + offset}h${size}v${size}h-${size}z`;
  };
  const range = ({ from, to, inset }: Phase) => {
    const a = Math.max(0, Math.floor((Date.parse(from) - t0) / WEEK));
    const b = Math.min(total, Math.ceil((Date.parse(to) - t0) / WEEK));
    return Array.from({ length: Math.max(0, b - a) }, (_, i) => square(a + i, inset)).join("");
  };
  return (
    <figure>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={label}>
        <svg viewBox={`0 0 624 ${Math.ceil(total / 52) * 12}`} role="img" aria-label={label} className="w-full min-w-[520px]">
          <path d={Array.from({ length: total }, (_, w) => square(w)).join("")} className="fill-surface-alt" />
          {phases.map((p) => <path key={p.label} d={range(p)} fill={p.color} />)}
        </svg>
      </div>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm">
        {phases.map((p) => <span key={p.label} className="inline-flex items-center gap-2"><span aria-hidden className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} /> {p.label}</span>)}
        <span className="text-muted">{new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(total)} {locale === "fa" ? "هفته" : "weeks"}</span>
      </figcaption>
    </figure>
  );
}
