import { cn } from "@/lib/utils";

const palettes = [
  ["#2563eb", "#7c3aed", "#06b6d4"],
  ["#0ea5e9", "#22c55e", "#14b8a6"],
  ["#7c3aed", "#db2777", "#f97316"],
  ["#4f46e5", "#0891b2", "#10b981"],
  ["#f59e0b", "#ef4444", "#8b5cf6"],
  ["#0f766e", "#2563eb", "#9333ea"],
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic generative cover art so every post gets a unique, on-brand image. */
export function PostCover({
  slug,
  label,
  className,
  large = false,
}: {
  slug: string;
  label: string;
  className?: string;
  large?: boolean;
}) {
  const h = hash(slug);
  const [a, b, c] = palettes[h % palettes.length];
  const x1 = 15 + (h % 50);
  const y1 = 20 + ((h >> 3) % 50);
  const x2 = 50 + ((h >> 5) % 40);
  const y2 = 40 + ((h >> 7) % 50);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(circle at ${x1}% ${y1}%, ${a} 0%, transparent 55%),
          radial-gradient(circle at ${x2}% ${y2}%, ${b} 0%, transparent 55%),
          linear-gradient(135deg, ${c}, ${a})`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid opacity-25 mix-blend-overlay" />
      <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay" viewBox="0 0 400 200" preserveAspectRatio="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${40 + i * 25} C 100 ${(h >> i) % 120}, 300 ${200 - ((h >> (i + 2)) % 120)}, 400 ${30 + i * 28}`}
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>
      <span
        className={cn(
          "absolute bottom-3 start-4 font-mono font-bold text-white/90 tracking-tight drop-shadow transition-transform duration-500 group-hover:-translate-y-1",
          large ? "text-2xl md:text-3xl" : "text-lg"
        )}
      >
        {"<"}
        {label}
        {" />"}
      </span>
    </div>
  );
}
