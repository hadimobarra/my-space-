"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

interface CopyButtonProps {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
  children: ReactNode;
}

export function CopyButton({ value, label, copiedLabel, className, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = () => navigator.clipboard?.writeText(value).then(() => setCopied(true), () => {});

  return (
    <>
      <button type="button" onClick={copy} aria-label={label} title={label} className={className}>
        {copied ? <Check size={15} className="text-accent" /> : children}
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
