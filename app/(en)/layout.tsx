import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/layout/root-document";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
