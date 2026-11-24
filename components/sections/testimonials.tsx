import { Quote } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import type { Dictionary } from "@/lib/dictionary";

export function Testimonials({ t }: { t: Dictionary }) {
  return (
    <SectionWrapper id="testimonials" eyebrow={t.eyebrows.testimonials} title={t.testimonials.title} subtitle={t.testimonials.subtitle} className="bg-surface/60">
      <div className="grid md:grid-cols-2 gap-6">
        {t.testimonials.items.map((item) => (
          <SpotlightCard as="figure" key={item.name} className="reveal relative p-7 md:p-8 h-full flex flex-col overflow-hidden">
            <Quote aria-hidden size={88} className="absolute -top-3 end-4 text-primary/[0.07] rotate-180" />
            <blockquote className="relative text-[15px] text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">{item.content}</blockquote>
            <figcaption className="pt-5 mt-auto border-t border-border">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted">{item.role}</p>
            </figcaption>
          </SpotlightCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
