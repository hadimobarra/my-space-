import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate, formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { PostMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { PostCover } from "./post-cover";

interface PostCardProps {
  post: PostMeta;
  locale: Locale;
  t: Dictionary;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}

export function PostCard({ post, locale, t, featured = false, headingLevel: Heading = "h3" }: PostCardProps) {
  const { title, description, date, tags } = post.frontmatter;

  return (
    <SpotlightCard
      // Articles live under the English root layout, so a link from Persian pages is a full page load.
      as={locale === "en" ? Link : "a"}
      href={`/blog/${post.slug}/`}
      className={cn("reveal group flex overflow-hidden h-full", featured ? "flex-col md:flex-row" : "flex-col")}
    >
      <PostCover slug={post.slug} label={tags[0] ?? "Post"} large={featured} className={featured ? "h-56 md:h-auto md:w-1/2 shrink-0" : "h-40"} />
      <div className={cn("flex flex-col flex-1", featured ? "p-7 md:p-10 justify-center" : "p-6")}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white">{t.blog.featured}</span>
          )}
          {tags.slice(0, featured ? 4 : 2).map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary-dark dark:text-primary">{tag}</span>
          ))}
        </div>
        <div lang="en" dir="ltr">
          <Heading className={cn("font-bold tracking-tight mb-2 group-hover:text-primary transition-colors", featured ? "text-2xl md:text-3xl leading-tight" : "text-lg leading-snug line-clamp-2")}>
            {title}
          </Heading>
          <p className={cn("text-sm text-muted leading-relaxed mb-5", featured ? "md:text-base line-clamp-4" : "line-clamp-3")}>{description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Calendar size={13} aria-hidden /> {formatDate(date, locale)}</span>
            <span className="flex items-center gap-1.5"><Clock size={13} aria-hidden /> {formatNumber(post.readingTime, locale)} {t.blog.minRead}</span>
          </div>
          <span aria-hidden className="w-8 h-8 rounded-full border border-border flex items-center justify-center transition-colors group-hover:bg-primary group-hover:border-primary group-hover:text-background rtl:-scale-x-100">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
}
