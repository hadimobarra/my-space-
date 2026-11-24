"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} data-track="resume-print" className={className}>
      <Printer size={16} />
      {label}
    </button>
  );
}
