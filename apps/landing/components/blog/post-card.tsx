"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { PostCover } from "./post-cover";
import { formatDate, cn } from "@/lib/utils";
import type { PostMeta } from "@/lib/mdx";

export function PostCard({
  post,
  featured = false,
  className,
}: {
  post: PostMeta;
  featured?: boolean;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const { title, description, date, tags } = post.frontmatter;

  return (
    <SpotlightCard
      as={Link}
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex overflow-hidden h-full",
        featured ? "flex-col md:flex-row" : "flex-col",
        className
      )}
    >
      <PostCover
        slug={post.slug}
        label={tags[0] ?? "Post"}
        large={featured}
        className={cn(featured ? "h-56 md:h-auto md:w-1/2 shrink-0" : "h-40")}
      />
      <div className={cn("flex flex-col flex-1", featured ? "p-7 md:p-10 justify-center" : "p-6")}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-primary to-violet text-white">
              {t("blog.featured")}
            </span>
          )}
          {tags.slice(0, featured ? 4 : 2).map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
        <h3
          className={cn(
            "font-bold tracking-tight mb-2 group-hover:text-primary transition-colors",
            featured ? "text-2xl md:text-3xl leading-tight" : "text-lg leading-snug line-clamp-2"
          )}
        >
          {title}
        </h3>
        <p className={cn("text-sm text-muted leading-relaxed mb-5", featured ? "md:text-base line-clamp-4" : "line-clamp-3")}>
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(date, i18n.language)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readingTime} {t("blog.minRead")}
            </span>
          </div>
          <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:rotate-45 rtl:-scale-x-100">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
}
