"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { CirclePause, CirclePlay, Trash2, Unplug, Upload } from "lucide-react";
import { fill, type Locale } from "@/lib/locale";
import type { UploadDemoLabels } from "./upload-demo";
import { TusMemoryServer, type LogEntry } from "./tus-memory-server";

const MB = 1024 * 1024;
const FILE_SIZE = 48 * MB;
const SPEED = 5 * MB;

type Phase = "idle" | "uploading" | "paused" | "retrying" | "done";

function sampleFile() {
  const row = "2026-11-24,orders,tehran,1024,3.14\n";
  const chunk = row.repeat(Math.ceil(MB / row.length)).slice(0, MB);
  return new Blob(Array.from({ length: FILE_SIZE / MB }, () => chunk), { type: "text/csv" });
}

export default function UploadDemoRunner({ labels, locale }: { labels: UploadDemoLabels; locale: Locale }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bytes, setBytes] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const engine = useRef<{ uppy: Uppy; server: TusMemoryServer } | null>(null);
  const logRef = useRef<HTMLOListElement>(null);

  useEffect(() => () => engine.current?.uppy.destroy(), []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const start = () => {
    engine.current?.uppy.destroy();
    setLog([]);
    setBytes(0);
    setPhase("uploading");

    const server = new TusMemoryServer(SPEED, (entry) => {
      setLog((entries) => [...entries, entry]);
      if (entry.failed) setPhase("retrying");
      else if (entry.status === "…") setPhase("uploading");
    });
    const uppy = new Uppy({ autoProceed: true }).use(Tus, {
      endpoint: "https://tus.invalid/files/", // never contacted: `server` answers every request
      httpStack: server,
      retryDelays: [400, 800, 1600, 3200],
      storeFingerprintForResuming: false,
    });
    uppy.on("upload-progress", (_file, progress) => setBytes(Number(progress.bytesUploaded) || 0));
    uppy.on("upload-success", () => {
      setBytes(FILE_SIZE);
      setPhase("done");
    });
    engine.current = { uppy, server };
    uppy.addFile({ name: "orders.csv", type: "text/csv", data: sampleFile() });
  };

  const togglePause = () => {
    const uppy = engine.current?.uppy;
    if (phase === "paused") {
      setPhase("uploading");
      uppy?.resumeAll();
    } else {
      setPhase("paused");
      uppy?.pauseAll();
    }
  };

  const cancel = () => {
    engine.current?.uppy.destroy();
    engine.current = null;
    setBytes(0);
    setLog([]);
    setPhase("idle");
  };

  const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 });
  const percent = Math.round((bytes / FILE_SIZE) * 100);
  const running = phase === "uploading" || phase === "paused" || phase === "retrying";
  const button = "inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/40 transition-colors disabled:opacity-50";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {running ? (
          <>
            <button type="button" onClick={togglePause} disabled={phase === "retrying"} className={button}>
              {phase === "paused" ? <CirclePlay size={16} className="rtl:-scale-x-100" /> : <CirclePause size={16} />}
              {phase === "paused" ? labels.resume : labels.pause}
            </button>
            <button type="button" onClick={() => engine.current?.server.dropConnection()} disabled={phase !== "uploading"} className={button}>
              <Unplug size={16} /> {labels.drop}
            </button>
            <button type="button" onClick={cancel} className={button}>
              <Trash2 size={16} /> {labels.cancel}
            </button>
          </>
        ) : (
          <button type="button" onClick={start} className="btn-gradient inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold">
            <Upload size={16} /> {fill(labels.start, { size: `${number.format(FILE_SIZE / MB)} MB` })}
          </button>
        )}
      </div>

      <div className="flex justify-between gap-4 text-sm mb-2">
        <span role="status" data-testid="upload-phase" data-phase={phase} className="font-medium">{labels[phase]}</span>
        <span className="text-muted tabular-nums" dir="ltr">
          {number.format(bytes / MB)} / {number.format(FILE_SIZE / MB)} MB
        </span>
      </div>
      <div role="progressbar" aria-label={labels.progress} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-2.5 rounded-full bg-surface-alt overflow-hidden">
        <div
          className={clsx("h-full transition-[width] duration-100", phase === "done" ? "bg-accent" : phase === "retrying" ? "bg-amber-500" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{labels.log}</p>
      <ol ref={logRef} dir="ltr" tabIndex={0} aria-label={labels.log} className="h-44 overflow-y-auto rounded-xl bg-code-bg p-4 font-mono text-xs leading-6 text-[#e6edf3]">
        {log.length === 0 && <li dir="auto" className="text-[#9aa4b5]">{labels.emptyLog}</li>}
        {log.map((entry) => (
          <li key={entry.id} className={clsx("grid grid-cols-[4.5rem_2.5rem_1fr] gap-2", entry.failed && "text-[#ff9b93]")}>
            <span className={entry.failed ? undefined : "text-[#79c0ff]"}>{entry.method}</span>
            <span>{entry.status}</span>
            <span>{entry.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
