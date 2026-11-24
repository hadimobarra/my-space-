import { cn } from "@/lib/utils";

/** Pre-cropped, pre-sized photo: 3 KB for the small sizes, about 34 KB for the hero. */
export function Avatar({ alt, large = false, className }: { alt: string; large?: boolean; className?: string }) {
  const size = large ? 480 : 112;
  return (
    <picture className={cn("block relative overflow-hidden rounded-full ring-2 ring-border shadow-md", className)}>
      <source srcSet={`/images/profile-${size}.avif`} type="image/avif" />
      <img
        src={`/images/profile-${size}.webp`}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        fetchPriority={large ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}
