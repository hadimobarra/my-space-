"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement, StaggerContainer, StaggerItem } from "@/components/shared/animated-element";
import { PostCard } from "@/components/blog/post-card";
import type { PostMeta } from "@/lib/mdx";

export function BlogPreview({ posts }: { posts: PostMeta[] }) {
  const { t } = useTranslation();
  const featured = posts.find((p) => p.frontmatter.featured) ?? posts[0];
  const others = posts.filter((p) => p.slug !== featured?.slug).slice(0, 3);

  if (!featured) return null;

  return (
    <SectionWrapper id="blog" title={t("blog.title")} subtitle={t("blog.subtitle")}>
      <AnimatedElement className="mb-6">
        <PostCard post={featured} featured />
      </AnimatedElement>
      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
        {others.map((post) => (
          <StaggerItem key={post.slug} className="h-full">
            <PostCard post={post} />
          </StaggerItem>
        ))}
      </StaggerContainer>
      <AnimatedElement delay={0.2} className="text-center mt-12">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 h-12 px-7 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all"
        >
          {t("blog.viewAll")} ({posts.length})
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
      </AnimatedElement>
    </SectionWrapper>
  );
}
