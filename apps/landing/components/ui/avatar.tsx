import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
  /** Extra classes for the <img>, e.g. to zoom past baked-in margins */
  imageClassName?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-24 w-24",
};

export function Avatar({
  src,
  alt,
  size = "md",
  className,
  fallback,
  imageClassName,
}: AvatarProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full ring-2 ring-border shadow-md",
          sizeMap[size],
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          sizes="(max-width: 768px) 60vw, 240px"
          priority
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-semibold",
        sizeMap[size],
        className
      )}
    >
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
}
