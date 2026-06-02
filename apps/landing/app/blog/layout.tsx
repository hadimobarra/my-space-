import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles about web development, React, Next.js, TypeScript, and front-end engineering best practices.",
  openGraph: {
    title: "Blog | Hadi Mobarra",
    description:
      "Read articles about web development, React, Next.js, TypeScript, and front-end engineering.",
    url: `${siteConfig.url}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
