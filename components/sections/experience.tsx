import { Building2, Calendar, GraduationCap } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { Tag } from "@/components/shared/tag";
import { Timeline, TimelineItem } from "@/components/shared/timeline";
import type { Dictionary } from "@/lib/dictionary";

export function Experience({ t }: { t: Dictionary }) {
  return (
    <SectionWrapper id="experience" eyebrow={t.eyebrows.experience} title={t.experience.title} subtitle={t.experience.subtitle} className="bg-surface/60">
      <Timeline>
        {t.experience.items.map((item) => (
          <TimelineItem key={item.company} icon={Building2}>
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm font-medium text-primary mt-0.5">{item.company}</p>
                </div>
                <span className="text-xs font-medium text-muted bg-surface-alt px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </SpotlightCard>
          </TimelineItem>
        ))}
        {t.education.items.map((item) => (
          <TimelineItem key={item.degree} icon={GraduationCap}>
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{item.degree}</h3>
                  <p className="text-sm font-medium text-primary mt-0.5">{item.institution}</p>
                </div>
                <span className="text-xs font-medium text-muted bg-surface-alt px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  {item.period}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </SpotlightCard>
          </TimelineItem>
        ))}
      </Timeline>
    </SectionWrapper>
  );
}
