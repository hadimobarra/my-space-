import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { fill } from "@/lib/locale";
import type { Series } from "@/lib/series";

/** Where the current article sits in its learning path. */
export function SeriesNav({ series, slug, t }: { series: Series; slug: string; t: Dictionary }) {
  const position = series.posts.findIndex((p) => p.slug === slug) + 1;
  return (
    <nav aria-label={t.blog.series} className="mb-12 rounded-2xl border border-border bg-surface p-5 md:p-6 print:hidden">
      <p className="text-xs text-muted mb-1">{t.blog.series} · {fill(t.blog.part, { n: position, total: series.posts.length })}</p>
      <Link href={`/blog/series/${series.slug}/`} className="font-semibold hover:text-primary transition-colors">{series.title}</Link>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-primary font-medium">{fill(t.blog.allArticlesIn, { count: series.posts.length })}</summary>
        <ol className="mt-3 space-y-2 list-decimal ps-5 marker:text-muted">
          {series.posts.map((post) => (
            <li key={post.slug}>
              {post.slug === slug ? (
                <strong aria-current="page">{post.frontmatter.title}</strong>
              ) : (
                <Link href={`/blog/${post.slug}/`} className="underline underline-offset-4 decoration-border hover:text-primary">{post.frontmatter.title}</Link>
              )}
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
