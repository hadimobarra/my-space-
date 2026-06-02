"use client";

import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useBlogTranslations } from "@/lib/use-blog-translations";
import type { Post } from "@/lib/mdx";

interface BlogListingProps {
  posts: Post[];
}

export function BlogListing({ posts }: BlogListingProps) {
  const t = useBlogTranslations();

  return (
    <div className="pt-24 pb-16 section-padding">
      <div className="container-wide">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t.blog}
          </h1>
          <p className="text-lg text-muted max-w-2xl">{t.description}</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">{t.comingSoon}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass-card rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.frontmatter.title}
                </h2>

                <p className="text-sm text-muted mb-4 line-clamp-3">
                  {post.frontmatter.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.frontmatter.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTime} {t.minRead}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t.readMore} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
