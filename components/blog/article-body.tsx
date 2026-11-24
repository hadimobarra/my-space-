import type { ReactNode } from "react";
import { EventLoopStepper } from "@/components/demos/event-loop-stepper";
import { InpDemo } from "@/components/demos/inp-demo";
import { RtlPlayground } from "@/components/demos/rtl-playground";
import { SignalsPlayground } from "@/components/demos/signals-playground";
import { UploadDemo } from "@/components/projects/upload-demo";
import { diagrams } from "@/content/diagrams";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/locale";
import { splitEmbeds } from "@/lib/mdx";
import { DiagramFigure } from "./diagrams";

function Embed({ name, locale }: { name: string; locale: Locale }): ReactNode {
  switch (name) {
    case "event-loop-stepper":
      return <EventLoopStepper />;
    case "signals-playground":
      return <SignalsPlayground />;
    case "inp-demo":
      return <InpDemo />;
    case "rtl-playground":
      return <RtlPlayground locale={locale} />;
    case "upload-demo":
      return <UploadDemo labels={getDictionary(locale).uploadDemo} locale={locale} />;
    default: {
      const diagram = diagrams[name];
      if (!diagram) throw new Error(`Unknown embed "${name}"`);
      return <DiagramFigure diagram={diagram} />;
    }
  }
}

/** Article HTML with its ```embed blocks replaced by demos and diagrams. */
export function ArticleBody({ html, locale }: { html: string; locale: Locale }) {
  return splitEmbeds(html).map((part, i) =>
    i % 2 === 0 ? (
      <div key={i} className="prose-article" dangerouslySetInnerHTML={{ __html: part }} />
    ) : (
      <div key={i} className="my-10" data-embed={part}>
        <Embed name={part} locale={locale} />
      </div>
    )
  );
}
