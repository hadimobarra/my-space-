"use client";

import { useState, type ReactNode } from "react";

/** Drag between two versions of the same thing. The panels come rendered from the server. */
export function TwoDirections({ left, right, label }: { left: ReactNode; right: ReactNode; label: string }) {
  const [position, setPosition] = useState(50);
  return (
    <div dir="ltr" className="relative rounded-3xl border border-border overflow-hidden shadow-xl shadow-primary/5 bg-card">
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        <div style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>{left}</div>
        <div style={{ clipPath: `inset(0 0 0 ${position}%)` }}>{right}</div>
      </div>
      <div aria-hidden className="absolute inset-y-0 w-0.5 bg-primary pointer-events-none" style={{ left: `${position}%` }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center text-sm font-bold shadow-lg">⇆</span>
      </div>
      <input type="range" min={0} max={100} value={position} onChange={(e) => setPosition(Number(e.target.value))} aria-label={label} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
    </div>
  );
}
