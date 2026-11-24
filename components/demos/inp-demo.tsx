"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { DemoFrame, demoButton } from "./demo-frame";

const WORK_MS = 400;

function block(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end);
}

function yieldToMain() {
  const { scheduler } = globalThis as { scheduler?: { yield?: () => Promise<void> } };
  return scheduler?.yield ? scheduler.yield() : new Promise<void>((resolve) => setTimeout(resolve));
}

/** Resolves in a new task after the next frame. */
function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
}

/** Time from the input event to the first frame after it. */
function measure(event: MouseEvent, done: (ms: number) => void) {
  const start = event.timeStamp;
  requestAnimationFrame(() => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => done(Math.round(performance.now() - start));
    channel.port2.postMessage(null);
  });
}

export function InpDemo() {
  const [results, setResults] = useState<{ blocked?: number; chunked?: number }>({});
  const [busy, setBusy] = useState(false);
  const frames = useRef<HTMLSpanElement>(null);

  // A frame counter that visibly stops when the main thread does.
  useEffect(() => {
    let count = 0;
    let id = requestAnimationFrame(function tick() {
      count++;
      if (frames.current) frames.current.textContent = String(count);
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const blocked = (event: MouseEvent) => {
    measure(event, (ms) => setResults((r) => ({ ...r, blocked: ms })));
    block(WORK_MS);
  };

  const chunked = async (event: MouseEvent) => {
    setBusy(true);
    measure(event, (ms) => setResults((r) => ({ ...r, chunked: ms })));
    // Yielding alone doesn't guarantee a frame: the browser may run the continuation first.
    await nextFrame();
    for (let done = 0; done < WORK_MS; done += 10) {
      await yieldToMain();
      block(10);
    }
    setBusy(false);
  };

  return (
    <DemoFrame title="Feel the difference">
      <p className="text-sm text-muted mb-4">Both buttons do the same {WORK_MS} ms of work. Watch the frame counter, and the time from your click to the next frame.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {([
          ["Block the main thread", blocked, results.blocked],
          ["Paint first, then yield every 10 ms", chunked, results.chunked],
        ] as const).map(([label, onClick, result]) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4">
            <button type="button" onClick={onClick} disabled={busy} className={`${demoButton} w-full`}>{label}</button>
            <p role="status" className="mt-3 text-sm text-center">
              {result === undefined ? <span className="text-muted">Not measured yet</span> : <><strong>{result} ms</strong> to the next frame</>}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm">Frames painted: <span ref={frames} className="font-mono tabular-nums">0</span></p>
    </DemoFrame>
  );
}
