import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/root-document";
import { persianFonts } from "@/lib/fonts/persian";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="fa" fontClassName={persianFonts}>
      {children}
    </RootDocument>
  );
}
