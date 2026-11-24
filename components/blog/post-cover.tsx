import { tileBackground } from "@/lib/tile";
import { cn } from "@/lib/utils";

/** A tile pattern generated from the slug, so every article and case study has its own. */
export function PostCover({ slug, label, className, large = false }: { slug: string; label: string; className?: string; large?: boolean }) {
  const tile = tileBackground(slug, large ? 96 : 72);
  return (
    <div
      aria-hidden
      dir="ltr"
      className={cn("relative overflow-hidden print:hidden", className)}
      style={{ backgroundColor: tile.color, backgroundImage: tile.image, backgroundSize: tile.size, backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <span className={cn("absolute bottom-3 left-4 font-mono font-bold text-white tracking-tight", large ? "text-2xl md:text-3xl" : "text-lg")}>{`<${label} />`}</span>
    </div>
  );
}
