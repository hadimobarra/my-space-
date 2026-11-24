import { BlogIndexPage, blogIndexMetadata } from "@/components/pages/blog-index-page";

export const metadata = blogIndexMetadata("fa");

export default function Page() {
  return <BlogIndexPage locale="fa" />;
}
