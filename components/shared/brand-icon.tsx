import { brandIcons } from "@/lib/brand-icons";

/** Decorative brand icon; renders nothing for names without one. */
export function BrandIcon({ name, size }: { name: string; size: number }) {
  const icon = brandIcons[name];
  if (!icon) return null;
  return (
    <svg aria-hidden width={size} height={size} fill="currentColor" style={{ color: icon.color }}>
      <use href={`/brand-icons.svg#${icon.id}`} />
    </svg>
  );
}
