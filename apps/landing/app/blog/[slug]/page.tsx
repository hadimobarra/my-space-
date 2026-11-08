import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getAllPostSlugs,
  renderMdxToHtml,
  extractHeadings,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/mdx";
import { siteConfig } from "@/lib/seo";
import { BlogPostContent } from "@/components/blog/blog-post-content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: `${post.frontmatter.title} | Hadi Mobarra`,
      description: post.frontmatter.description,
      url: `${siteConfig.url}/blog/${slug}`,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
    alternates: { canonical: `${siteConfig.url}/blog/${slug}/` },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = await renderMdxToHtml(post.content);
  const { prev, next } = getAdjacentPosts(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    keywords: post.frontmatter.tags.join(", "),
    author: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
    url: `${siteConfig.url}/blog/${slug}/`,
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
    <BlogPostContent
      slug={post.slug}
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      date={post.frontmatter.date}
      readingTime={post.readingTime}
      tags={post.frontmatter.tags}
      htmlContent={htmlContent}
      headings={extractHeadings(htmlContent)}
      prev={prev}
      next={next}
      related={getRelatedPosts(slug)}
    />
    </>
  );
}
