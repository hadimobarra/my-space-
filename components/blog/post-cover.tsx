import { coverPalette, hash } from "@/lib/cover";
import { cn } from "@/lib/utils";

/** Deterministic generative cover art, so every post and case study gets its own image. */
export function PostCover({ slug, label, className, large = false }: { slug: string; label: string; className?: string; large?: boolean }) {
  const h = hash(slug);
  const [a, b, c] = coverPalette(slug);
  const x1 = 15 + (h % 50);
  const y1 = 20 + ((h >> 3) % 50);
  const x2 = 50 + ((h >> 5) % 40);
  const y2 = 40 + ((h >> 7) % 50);

  const waves = Array.from(
    { length: 6 },
    (_, i) => `M0 ${40 + i * 25}C100 ${(h >> i) % 120} 300 ${200 - ((h >> (i + 2)) % 120)} 400 ${30 + i * 28}`
  ).join("");

  return (
    <div
      className={cn("relative overflow-hidden print:hidden", className)}
      dir="ltr"
      style={{
        background: `radial-gradient(circle at ${x1}% ${y1}%, ${a} 0%, transparent 55%),
          radial-gradient(circle at ${x2}% ${y2}%, ${b} 0%, transparent 55%),
          linear-gradient(135deg, ${c}, ${a})`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid opacity-25 mix-blend-overlay" />
      <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d={waves} stroke="white" strokeWidth="1" fill="none" />
      </svg>
      <span className={cn("absolute bottom-3 left-4 font-mono font-bold text-white/90 tracking-tight drop-shadow", large ? "text-2xl md:text-3xl" : "text-lg")}>
        {`<${label} />`}
      </span>
    </div>
  );
}
