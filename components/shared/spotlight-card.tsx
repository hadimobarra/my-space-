import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Card with a pointer-following glow. PointerEffects sets --mx/--my for every card on the page. */
export function SpotlightCard<T extends ElementType = "div">({ as, children, className, ...rest }: SpotlightCardProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp
      className={cn(
        "spotlight glass-card rounded-2xl transition-[transform,box-shadow] duration-300 ease-out hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        className
      )}
      {...rest}
    >
      <span aria-hidden className="spotlight-border" />
      {children}
    </Comp>
  );
}
