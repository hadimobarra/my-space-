"use client";

import { useState, type ReactNode } from "react";
import { clsx } from "clsx";

interface Props {
  items: { id: string; trust: string; search: string; node: ReactNode }[];
  filters: { value: string; label: string }[];
  labels: { search: string; all: string; empty: string };
}

/** Trust filter and text search over server-rendered claims. */
export function CatalogFilter({ items, filters, labels }: Props) {
  const [query, setQuery] = useState("");
  const [trust, setTrust] = useState("");
  const q = query.trim().toLowerCase();
  const visible = items.filter((i) => (!trust || i.trust === trust) && (!q || i.search.includes(q)));

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.search} aria-label={labels.search} className="h-10 flex-1 min-w-56 rounded-full border border-border bg-background px-4 text-sm placeholder:text-muted" />
        {[{ value: "", label: labels.all }, ...filters].map((f) => (
          <button key={f.value} type="button" aria-pressed={trust === f.value} onClick={() => setTrust(f.value)} className={clsx("h-10 px-4 rounded-full border text-xs font-medium transition-colors", trust === f.value ? "bg-foreground text-background border-foreground" : "border-border bg-card text-muted hover:text-foreground")}>
            {f.label}
          </button>
        ))}
      </div>
      <ul className="space-y-4">{visible.map((i) => <li key={i.id} id={i.id} className="scroll-mt-28">{i.node}</li>)}</ul>
      {visible.length === 0 && <p role="status" className="text-muted">{labels.empty}</p>}
    </>
  );
}
