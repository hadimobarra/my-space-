"use client";

import { useState } from "react";
import { DemoFrame, demoButton } from "./demo-frame";
import { computed, effect, signal } from "./signals-core";

interface View {
  price: number;
  quantity: number;
  note: string;
  total: number;
  computedRuns: number;
  totalEffectRuns: number;
  noteEffectRuns: number;
}

function createGraph() {
  const runs = { computedRuns: 0, totalEffectRuns: 0, noteEffectRuns: 0 };
  const price = signal(20);
  const quantity = signal(2);
  const note = signal("gift");
  const total = computed(() => {
    runs.computedRuns++;
    return price.get() * quantity.get();
  });
  const values = { total: 0, note: "" };
  effect(() => {
    runs.totalEffectRuns++;
    values.total = total.get();
  });
  effect(() => {
    runs.noteEffectRuns++;
    values.note = note.get();
  });
  const read = (): View => ({ price: price.get(), quantity: quantity.get(), ...values, ...runs });
  return { price, quantity, note, read };
}

type Graph = ReturnType<typeof createGraph>;

export function SignalsPlayground() {
  const [graph] = useState(createGraph);
  const [view, setView] = useState(graph.read);

  const change = (fn: (g: Graph) => void) => () => {
    fn(graph);
    setView(graph.read());
  };

  const rows: [string, string | number, string][] = [
    ["total = price × quantity", view.total, `computed ran ${view.computedRuns}×`],
    ["effect reading total", view.total, `ran ${view.totalEffectRuns}×`],
    ["effect reading note", view.note, `ran ${view.noteEffectRuns}×`],
  ];

  return (
    <DemoFrame title="Signals playground">
      <div className="flex flex-wrap gap-2 mb-5">
        <button type="button" className={demoButton} onClick={change((g) => g.price.set(g.price.get() + 5))}>price + 5</button>
        <button type="button" className={demoButton} onClick={change((g) => g.quantity.set(g.quantity.get() + 1))}>quantity + 1</button>
        <button type="button" className={demoButton} onClick={change((g) => g.note.set(g.note.get() === "gift" ? "express" : "gift"))}>change note</button>
        <button type="button" className={demoButton} onClick={change((g) => g.price.set(g.price.get()))}>set price to the same value</button>
      </div>
      <p className="font-mono text-sm mb-4">
        price = {view.price}, quantity = {view.quantity}, note = &quot;{view.note}&quot;
      </p>
      <ul aria-live="polite" className="divide-y divide-border border-y border-border text-sm">
        {rows.map(([label, value, count]) => (
          <li key={label} className="flex flex-wrap items-center justify-between gap-x-4 py-2.5">
            <span className="font-mono">{label}</span>
            <span><strong>{value}</strong> <span className="text-muted ms-2">{count}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">Changing the note never recalculates the total, and setting the same value runs nothing.</p>
    </DemoFrame>
  );
}
