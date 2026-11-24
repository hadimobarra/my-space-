import { BlogIndexPage, blogIndexMetadata } from "@/components/pages/blog-index-page";

export const metadata = blogIndexMetadata("en");

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
