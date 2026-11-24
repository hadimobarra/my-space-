"use client";

import { useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";
import { fill } from "@/lib/locale";

interface FilterItem {
  slug: string;
  /** Lower-case text the search runs on. */
  search: string;
  tags: string[];
  /** Server-rendered card. */
  card: ReactNode;
}

interface BlogFilterProps {
  items: FilterItem[];
  tags: string[];
  featured: { slug: string; card: ReactNode };
  labels: { searchPlaceholder: string; clearSearch: string; allTopics: string; noResults: string; clearFilters: string; resultsCount: string };
}

/** Search and topic filter. The cards themselves are rendered on the server. */
export function BlogFilter({ items, tags, featured, labels }: BlogFilterProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtering = Boolean(q || activeTag);
  const visible = items.filter(
    (item) => (!activeTag || item.tags.includes(activeTag)) && (!q || item.search.includes(q)) && (filtering || item.slug !== featured.slug)
  );

  const reset = () => {
    setQuery("");
    setActiveTag(null);
  };

  return (
    <>
      <div className="max-w-xl mx-auto relative group">
        <Search size={18} aria-hidden className="absolute z-10 start-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          className="w-full h-13 ps-12 pe-12 rounded-2xl glass-strong shadow-lg shadow-primary/5 text-sm placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label={labels.clearSearch} className="absolute end-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:bg-surface-alt">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-6 mb-12 flex flex-wrap justify-center gap-2">
        {[null, ...tags].map((tag) => (
          <button
            key={tag ?? "all"}
            type="button"
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            className={clsx(
              "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
              activeTag === tag
                ? "text-white border-transparent bg-gradient-to-r from-[#2563eb] to-[#7c3aed]"
                : "border-border bg-card text-muted hover:text-foreground hover:border-primary/30"
            )}
          >
            {tag ?? labels.allTopics}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {filtering ? fill(labels.resultsCount, { count: visible.length }) : ""}
      </p>

      {!filtering && <div className="mb-8">{featured.card}</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((item) => <div key={item.slug}>{item.card}</div>)}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted mb-4">{labels.noResults}</p>
          <button type="button" onClick={reset} className="text-sm font-medium text-primary hover:underline">{labels.clearFilters}</button>
        </div>
      )}
    </>
  );
}
