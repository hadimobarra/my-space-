"use client";

import { useEffect, useState } from "react";
import { searchSite, type SearchHit } from "@/lib/pagefind";

/** Full-text results for a query of at least two characters. */
export function useSiteSearch(query: string, limit?: number): SearchHit[] {
  const [result, setResult] = useState<{ query: string; hits: SearchHit[] }>({ query: "", hits: [] });
  const q = query.trim();

  useEffect(() => {
    if (q.length < 2) return;
    let current = true;
    const timer = window.setTimeout(async () => {
      const hits = await searchSite(q, limit);
      if (current) setResult({ query: q, hits });
    }, 150);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [q, limit]);

  return q.length >= 2 && result.query === q ? result.hits : [];
}
