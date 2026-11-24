import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import type { Dictionary } from "@/lib/dictionary";
import { formatNumber } from "@/lib/format";
import { localePath, type Locale } from "@/lib/locale";
import { getAllPostMeta } from "@/lib/mdx";

export function BlogPreview({ locale, t }: { locale: Locale; t: Dictionary }) {
  const posts = getAllPostMeta();
  const featured = posts.find((p) => p.frontmatter.featured) ?? posts[0];
  const others = posts.filter((p) => p.slug !== featured?.slug).slice(0, 3);
  if (!featured) return null;

  return (
    <SectionWrapper id="blog" eyebrow={t.eyebrows.blog} title={t.blog.title} subtitle={`${t.blog.subtitle}${t.blog.langNote ? `. ${t.blog.langNote}` : ""}`}>
      <div className="mb-6">
        <PostCard post={featured} locale={locale} t={t} featured />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((post) => <PostCard key={post.slug} post={post} locale={locale} t={t} />)}
      </div>
      <div className="text-center mt-12">
        <Link
          href={localePath(locale, "/blog/")}
          className="group inline-flex items-center gap-2 h-12 px-7 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
        >
          {t.blog.viewAll} ({formatNumber(posts.length, locale)})
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
