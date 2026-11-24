"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Play } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/locale";

export type UploadDemoLabels = Dictionary["uploadDemo"];

const Runner = dynamic(() => import("./upload-demo-runner"), { ssr: false });

/** Uppy and tus-js-client are only downloaded once the visitor starts the demo. */
export function UploadDemo({ labels, locale }: { labels: UploadDemoLabels; locale: Locale }) {
  const [started, setStarted] = useState(false);

  return (
    <section id="demo" aria-labelledby="demo-title" className="mt-14 glass-card rounded-3xl p-6 md:p-8 scroll-mt-24 print:hidden">
      <h2 id="demo-title" className="text-2xl font-bold tracking-tight mb-2">{labels.title}</h2>
      <p className="text-sm text-muted leading-relaxed mb-2">{labels.note}</p>
      <p className="text-sm text-muted leading-relaxed mb-6">{labels.hint}</p>
      {started ? (
        <Runner labels={labels} locale={locale} />
      ) : (
        <button type="button" onClick={() => setStarted(true)} data-track="upload-demo" className="btn-gradient inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold">
          <Play size={15} className="fill-current rtl:-scale-x-100" /> {labels.load}
        </button>
      )}
    </section>
  );
}
