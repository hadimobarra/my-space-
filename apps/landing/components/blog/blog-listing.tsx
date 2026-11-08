"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Rss } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TextReveal } from "@/components/shared/text-reveal";
import { Footer } from "@/components/sections/footer";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/lib/mdx";

export function BlogListing({ posts }: { posts: PostMeta[] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.frontmatter.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  }, [posts]);

  const totalMinutes = posts.reduce((sum, p) => sum + p.readingTime, 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.frontmatter.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        p.frontmatter.title.toLowerCase().includes(q) ||
        p.frontmatter.description.toLowerCase().includes(q) ||
        p.frontmatter.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  const isFiltering = Boolean(query.trim() || activeTag);
  const featured = !isFiltering ? posts.find((p) => p.frontmatter.featured) ?? posts[0] : undefined;
  const rest = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12 section-padding noise">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid mask-radial opacity-60" />
          <div className="absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full bg-primary/20 blur-[120px] animate-aurora" />
          <div className="absolute -top-20 right-1/4 w-[26rem] h-[26rem] rounded-full bg-violet/20 blur-[120px] animate-aurora [animation-delay:-8s]" />
        </div>
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur text-xs font-medium text-muted"
          >
            <BookOpen size={13} className="text-primary" />
            {posts.length} {t("blog.articles")} · {totalMinutes} {t("blog.minRead")}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5">
            <TextReveal text={t("blog.pageTitle")} wordClassName="gradient-text-animated" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted max-w-2xl mx-auto mb-10"
          >
            {t("blog.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative group">
              <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("blog.searchPlaceholder")}
                aria-label={t("blog.searchPlaceholder")}
                className="w-full h-13 ps-12 pe-12 rounded-2xl glass-strong shadow-lg shadow-primary/5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:bg-surface-alt"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {[null, ...tags].map((tag) => {
              const active = activeTag === tag;
              return (
                <button
                  key={tag ?? "all"}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    active ? "text-white border-transparent" : "border-border bg-card/60 text-muted hover:text-foreground hover:border-primary/30"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tag-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-violet"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tag ?? t("blog.allTopics")}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 section-padding">
        <div className="container-wide">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <PostCard post={featured} featured />
            </motion.div>
          )}

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {rest.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-muted mb-4">{t("blog.noResults")}</p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTag(null);
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("blog.clearFilters")}
              </button>
            </motion.div>
          )}

          <div className="mt-16 flex justify-center">
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-medium text-muted hover:text-primary hover:border-primary/30 transition-colors"
            >
              <Rss size={13} /> {t("blog.subscribe")}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
