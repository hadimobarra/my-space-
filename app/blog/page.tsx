import { getAllPostMeta } from "@/lib/mdx";
import { BlogListing } from "@/components/blog/blog-listing";

export default function BlogPage() {
  return <BlogListing posts={getAllPostMeta()} />;
}
