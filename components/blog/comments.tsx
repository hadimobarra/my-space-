"use client";

import { useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import type { Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

interface CommentsProps {
  locale: Locale;
  term: string;
  title: string;
  labels: { comments: string; loadComments: string; commentsNote: string; discuss: string };
}

/** GitHub Discussions through Giscus, loaded on request. Falls back to a link when Giscus isn't set up. */
export function Comments({ locale, term, title, labels }: CommentsProps) {
  const container = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { resolvedTheme } = useTheme();
  const { repoId, category, categoryId } = siteConfig.giscus;
  const button = "inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary/40 transition-colors";

  const load = () => {
    setLoaded(true);
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.assign(script.dataset, {
      repo: siteConfig.links.repository,
      repoId,
      category,
      categoryId,
      mapping: "specific",
      term,
      strict: "1",
      reactionsEnabled: "1",
      inputPosition: "top",
      theme: resolvedTheme === "dark" ? "dark" : "light",
      lang: locale,
    });
    container.current?.append(script);
  };

  return (
    <section aria-labelledby="comments-title" className="mt-12 print:hidden">
      <h2 id="comments-title" className="text-xl font-bold tracking-tight mb-3">{labels.comments}</h2>
      {categoryId ? (
        <>
          {!loaded && (
            <>
              <p className="text-sm text-muted mb-4">{labels.commentsNote}</p>
              <button type="button" onClick={load} data-track="comments" className={button}>
                <MessageSquare size={16} /> {labels.loadComments}
              </button>
            </>
          )}
          <div ref={container} />
        </>
      ) : (
        <a
          href={`https://github.com/${siteConfig.links.repository}/discussions/new?category=general&title=${encodeURIComponent(title)}`}
          data-track="discuss"
          className={button}
        >
          <MessageSquare size={16} /> {labels.discuss}
        </a>
      )}
    </section>
  );
}
