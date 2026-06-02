"use client";

import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useBlogTranslations } from "@/lib/use-blog-translations";

interface BlogPostContentProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  htmlContent: string;
}

export function BlogPostContent({
  slug,
  title,
  description,
  date,
  readingTime,
  tags,
  htmlContent,
}: BlogPostContentProps) {
  const t = useBlogTranslations();

  return (
    <div className="pt-24 pb-16 section-padding">
      <div className="container-wide max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t.backToBlog}
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {title}
            </h1>

            <p className="text-lg text-muted mb-4">{description}</p>

            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {readingTime} {t.minRead}
              </span>
            </div>
          </header>

          <div
            className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:text-sm prose-code:bg-surface-alt prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  );
}
