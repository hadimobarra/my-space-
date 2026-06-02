import { getAllPosts } from "@/lib/mdx";
import { BlogListing } from "@/components/blog/blog-listing";

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogListing posts={posts} />;
}
