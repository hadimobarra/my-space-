"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { DemoFrame, demoButton } from "./demo-frame";

const CODE = [
  'console.log("script");',
  'setTimeout(() => console.log("timeout"), 0);',
  "Promise.resolve()",
  '  .then(() => console.log("A"))',
  '  .then(() => console.log("B"));',
  'queueMicrotask(() => console.log("5"));',
  'console.log("end");',
];

interface Step {
  line: number | null;
  stack: string[];
  micro: string[];
  tasks: string[];
  output: string[];
  note: string;
}

const STEPS: Step[] = [
  { line: 0, stack: ["script"], micro: [], tasks: [], output: ["script"], note: "The whole script runs as one task. Synchronous code prints straight away." },
  { line: 1, stack: ["script"], micro: [], tasks: ["timeout"], output: ["script"], note: "setTimeout puts its callback in the task queue, even with a delay of 0." },
  { line: 3, stack: ["script"], micro: ["A"], tasks: ["timeout"], output: ["script"], note: "The promise is already resolved, so A becomes a microtask. B waits for A." },
  { line: 5, stack: ["script"], micro: ["A", "5"], tasks: ["timeout"], output: ["script"], note: "queueMicrotask adds to the same queue, behind A." },
  { line: 6, stack: ["script"], micro: ["A", "5"], tasks: ["timeout"], output: ["script", "end"], note: "The last synchronous line. Now the script task is finished." },
  { line: 3, stack: ["A"], micro: ["5", "B"], tasks: ["timeout"], output: ["script", "end", "A"], note: "Microtasks drain before any other task. Running A queues B at the end." },
  { line: 5, stack: ["5"], micro: ["B"], tasks: ["timeout"], output: ["script", "end", "A", "5"], note: "5 was queued before B, so it goes first." },
  { line: 4, stack: ["B"], micro: [], tasks: ["timeout"], output: ["script", "end", "A", "5", "B"], note: "B was added while draining, and still runs in this turn." },
  { line: null, stack: [], micro: [], tasks: ["timeout"], output: ["script", "end", "A", "5", "B"], note: "The microtask queue is empty. The browser may render a frame here." },
  { line: 1, stack: ["timeout"], micro: [], tasks: [], output: ["script", "end", "A", "5", "B", "timeout"], note: "Only now does the loop take the next task." },
];

function Queue({ label, items, tone }: { label: string; items: string[]; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 min-h-20">
      <p className="text-xs font-semibold text-muted mb-2">{label}</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item} className={clsx("rounded-md px-2 py-0.5 font-mono text-xs text-white", tone)}>{item}</li>
        ))}
        {items.length === 0 && <li className="text-xs text-muted">empty</li>}
      </ul>
    </div>
  );
}

export function EventLoopStepper() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  return (
    <DemoFrame title="Step through the event loop">
      <div className="grid md:grid-cols-2 gap-4">
        <ol dir="ltr" tabIndex={0} aria-label="Code" className="rounded-xl bg-code-bg py-3 font-mono text-xs leading-7 text-[#e6edf3] overflow-x-auto">
          {CODE.map((line, i) => (
            <li key={i} aria-current={step.line === i ? "step" : undefined} className={clsx("px-4 whitespace-pre border-s-4", step.line === i ? "bg-[#1f3a5f] border-[#79c0ff]" : "border-transparent")}>
              {line}
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-2 gap-3">
          <Queue label="Call stack" items={step.stack} tone="bg-[#1d4ed8]" />
          <Queue label="Microtasks" items={step.micro} tone="bg-[#6d28d9]" />
          <Queue label="Tasks" items={step.tasks} tone="bg-[#475569]" />
          <Queue label="Console" items={step.output} tone="bg-[#047857]" />
        </div>
      </div>
      <p role="status" className="mt-4 text-sm min-h-12">
        <strong>Step {index + 1} of {STEPS.length}.</strong> {step.note}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className={demoButton} disabled={index === 0} onClick={() => setIndex(index - 1)}>Back</button>
        <button type="button" className={demoButton} disabled={index === STEPS.length - 1} onClick={() => setIndex(index + 1)}>Next step</button>
        <button type="button" className={demoButton} disabled={index === 0} onClick={() => setIndex(0)}>Reset</button>
      </div>
    </DemoFrame>
  );
}
