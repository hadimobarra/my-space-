"use client";

import { useRef, type ElementType, type ReactNode, type MouseEvent, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Subtle 3D tilt that follows the pointer */
  tilt?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/**
 * Card with a pointer-following radial glow and glowing border.
 * Writes --mx/--my straight to the element's style to avoid React re-renders
 * on every mousemove.
 */
export function SpotlightCard<T extends ElementType = "div">({
  as,
  children,
  className,
  tilt = false,
  ...rest
}: SpotlightCardProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (tilt) {
        const rx = ((y / rect.height) - 0.5) * -6;
        const ry = ((x / rect.width) - 0.5) * 6;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }
    });
  };

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (tilt && ref.current) ref.current.style.transform = "";
  };

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "spotlight glass-card rounded-2xl transition-[transform,box-shadow] duration-300 ease-out hover:shadow-xl hover:shadow-primary/5",
        !tilt && "hover:-translate-y-1",
        className
      )}
      {...rest}
    >
      <span aria-hidden className="spotlight-border" />
      {children}
    </Comp>
  );
}
