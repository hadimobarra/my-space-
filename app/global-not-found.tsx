import type { Metadata } from "next";
import "./globals.css";
import { RootDocument } from "@/components/layout/root-document";
import { getDictionary } from "@/lib/dictionary";
import { latinFonts } from "@/lib/fonts/latin";

const { notFound } = getDictionary("en");

export const metadata: Metadata = { title: `${notFound.title} | Hadi Mobarra`, robots: { index: false } };

/** Exported as 404.html. Plain links: the visitor may come from either language. */
export default function GlobalNotFound() {
  const button = "inline-flex items-center h-11 px-6 rounded-full text-sm font-semibold";
  return (
    <RootDocument locale="en" fontClassName={latinFonts}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center section-padding pt-28 pb-16">
        <p className="text-7xl font-bold tracking-tighter gradient-text mb-4">404</p>
        <h1 className="text-2xl font-bold mb-3">{notFound.title}</h1>
        <p className="text-muted mb-8 max-w-md">{notFound.text}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload leaves the 404 shell */}
          <a href="/" className={`${button} btn-gradient`}>{notFound.home}</a>
          <a href="/fa/" lang="fa" className={`${button} border border-border bg-card`}>فارسی</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload leaves the 404 shell */}
          <a href="/blog/" className={`${button} border border-border bg-card`}>{notFound.blog}</a>
        </div>
      </div>
    </RootDocument>
  );
}
