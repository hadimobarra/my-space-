"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedElement } from "@/components/shared/animated-element";

interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date: string;
}

export function BlogPreview() {
  const { t } = useTranslation();
  const posts = t("blog.previewPosts", { returnObjects: true }) as BlogPost[];

  return (
    <SectionWrapper
      id="blog"
      title={t("blog.title")}
      subtitle={t("blog.subtitle")}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} />
        ))}
      </div>
      <AnimatedElement delay={0.3} direction="up" className="text-center mt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t("blog.viewAll")}
          <ArrowRight size={16} />
        </Link>
      </AnimatedElement>
    </SectionWrapper>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <AnimatedElement ref={ref} delay={index * 0.1} direction="up">
      <Link href={`/blog/${post.slug}`}>
        <div className="glass-card rounded-2xl p-6 h-full group hover:shadow-lg transition-all">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted mb-3">
            <Calendar size={12} />
            {post.date}
          </span>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {post.description}
          </p>
        </div>
      </Link>
    </AnimatedElement>
  );
}
