import { BlogPostPage, blogPostMetadata } from "@/components/pages/blog-post-page";
import { getAllPostSlugs } from "@/lib/mdx";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs("fa").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return blogPostMetadata("fa", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <BlogPostPage locale="fa" slug={(await params).slug} />;
}
