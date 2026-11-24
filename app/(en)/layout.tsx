import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/root-document";
import { latinFonts } from "@/lib/fonts/latin";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="en" fontClassName={latinFonts}>
      {children}
    </RootDocument>
  );
}
