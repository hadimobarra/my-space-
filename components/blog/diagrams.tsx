import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "red" | "gray" | "violet";

export interface FlowStep {
  title: string;
  note?: string;
  tone?: Tone;
}

export type Diagram =
  | { kind: "flow"; caption: string; steps: FlowStep[] }
  | { kind: "lanes"; caption: string; lanes: { label: string; bars: { text: string; start: number; width: number; tone: Tone }[] }[] };

const border: Record<Tone, string> = {
  blue: "border-t-[#2563eb]",
  green: "border-t-[#059669]",
  red: "border-t-[#dc2626]",
  gray: "border-t-[#64748b]",
  violet: "border-t-[#7c3aed]",
};

/** Solid fills dark enough for white text. */
const fill: Record<Tone, string> = { blue: "#1d4ed8", green: "#047857", red: "#b91c1c", gray: "#475569", violet: "#6d28d9" };

/** Diagrams are HTML, so they follow the theme, scale with the text and can be read aloud. */
export function DiagramFigure({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="rounded-2xl border border-border bg-surface p-5 md:p-7">
      {diagram.kind === "flow" ? (
        <ol className="flex flex-col md:flex-row md:items-stretch gap-2">
          {diagram.steps.map((step, i) => (
            <li key={step.title} className="contents">
              {i > 0 && (
                <span aria-hidden className="self-center text-muted shrink-0">
                  <ArrowDown size={16} className="md:hidden" />
                  <ArrowRight size={16} className="hidden md:block rtl:rotate-180" />
                </span>
              )}
              <div className={cn("flex-1 min-w-0 rounded-xl border border-border border-t-4 bg-card px-4 py-3", border[step.tone ?? "blue"])}>
                <p className="text-sm font-semibold leading-snug">{step.title}</p>
                {step.note && <p className="mt-1 text-xs text-muted leading-relaxed">{step.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="space-y-4">
          {diagram.lanes.map((lane) => (
            <div key={lane.label}>
              <p className="text-xs font-semibold mb-1.5">{lane.label}</p>
              <ul dir="ltr" className="relative h-9 rounded-lg bg-surface-alt overflow-hidden">
                {lane.bars.map((bar, i) => (
                  <li
                    key={i}
                    className="absolute inset-y-0 flex items-center justify-center px-1 text-[11px] font-medium text-white whitespace-nowrap overflow-hidden border-s-2 border-surface-alt"
                    style={{ insetInlineStart: `${bar.start}%`, width: `${bar.width}%`, backgroundColor: fill[bar.tone] }}
                  >
                    {bar.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <figcaption className="mt-4 text-sm text-muted text-center">{diagram.caption}</figcaption>
    </figure>
  );
}
