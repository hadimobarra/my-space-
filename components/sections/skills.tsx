import { Cpu } from "lucide-react";
import { BrandIcon } from "@/components/shared/brand-icon";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { brandIcons } from "@/lib/brand-icons";
import type { Dictionary } from "@/lib/dictionary";

export function Skills({ t }: { t: Dictionary }) {
  return (
    <SectionWrapper id="skills" eyebrow={t.eyebrows.skills} title={t.skills.title} subtitle={t.skills.subtitle} className="bg-surface/60">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {t.skills.groups.map((group) => (
          <SpotlightCard key={group.title} className="reveal p-6">
            <h3 className="text-base font-semibold mb-5">{group.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((name) => (
                <li key={name} className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-lg bg-surface-alt/80 border border-border/60">
                  {name in brandIcons ? <BrandIcon name={name} size={14} /> : <Cpu size={13} aria-hidden className="text-muted" />}
                  <span dir="auto">{name}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
