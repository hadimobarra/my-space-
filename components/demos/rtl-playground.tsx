"use client";

import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { DemoFrame, demoButton } from "./demo-frame";

const copy = {
  en: {
    title: "Physical or logical?",
    rtl: "Right-to-left", ltr: "Left-to-right", logical: "Logical properties", physical: "Physical properties", isolate: "Isolate the file path", raw: "Don't isolate it",
    hint: "The preview starts right-to-left with physical properties. Switch to logical ones and watch the icon spacing, the accent edge and the arrow.",
  },
  fa: {
    title: "فیزیکی یا منطقی؟",
    rtl: "راست‌به‌چپ", ltr: "چپ‌به‌راست", logical: "ویژگی‌های منطقی", physical: "ویژگی‌های فیزیکی", isolate: "جداسازی مسیر فایل", raw: "بدون جداسازی",
    hint: "پیش‌نمایش راست‌به‌چپ و با ویژگی‌های فیزیکی شروع می‌شود. ویژگی‌های منطقی را انتخاب کنید و به فاصله آیکون، لبه رنگی و فلش نگاه کنید.",
  },
};

export function RtlPlayground({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [rtl, setRtl] = useState(true);
  const [logical, setLogical] = useState(false);
  const [isolate, setIsolate] = useState(false);

  const edge = logical ? { borderInlineStart: "4px solid #2563eb", paddingInlineStart: 16 } : { borderLeft: "4px solid #2563eb", paddingLeft: 16 };
  const gap = logical ? { marginInlineEnd: 12 } : { marginRight: 12 };
  const path = "/data/2026/report (final).csv";

  return (
    <DemoFrame title={t.title}>
      <div className="flex flex-wrap gap-2 mb-5">
        <button type="button" className={demoButton} onClick={() => setRtl(!rtl)}>{rtl ? t.ltr : t.rtl}</button>
        <button type="button" className={demoButton} onClick={() => setLogical(!logical)}>{logical ? t.physical : t.logical}</button>
        <button type="button" className={demoButton} onClick={() => setIsolate(!isolate)}>{isolate ? t.raw : t.isolate}</button>
      </div>
      <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "fa" : "en"} data-testid="rtl-preview" className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center bg-surface rounded-lg py-3 pe-3" style={edge}>
          <FileText size={20} className="text-primary shrink-0" style={gap} />
          <span className="flex-1 min-w-0 text-sm break-words">
            {rtl ? "فایل " : "File "}
            {isolate ? <bdi dir="ltr">{path}</bdi> : path}
            {rtl ? " آماده است!" : " is ready!"}
          </span>
          <ChevronRight size={18} className={logical ? "text-muted rtl:rotate-180" : "text-muted"} />
        </div>
      </div>
      <pre dir="ltr" tabIndex={0} className="mt-4 overflow-x-auto rounded-xl bg-code-bg p-4 font-mono text-xs leading-6 text-[#e6edf3]">
        {logical
          ? "border-inline-start: 4px solid;\npadding-inline-start: 16px;\nmargin-inline-end: 12px;"
          : "border-left: 4px solid;\npadding-left: 16px;\nmargin-right: 12px;"}
        {isolate ? `\n\n<bdi dir="ltr">${path}</bdi>` : ""}
      </pre>
      <p className="mt-4 text-sm text-muted">{t.hint}</p>
    </DemoFrame>
  );
}
