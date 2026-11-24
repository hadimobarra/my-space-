"use client";

import { useEffect, useState } from "react";

/** Copy handling for every code block on the page (the buttons are rendered at build time). */
export function CodeCopy({ copiedLabel }: { copiedLabel: string }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer = 0;
    const onClick = async (e: MouseEvent) => {
      const button = (e.target as Element | null)?.closest<HTMLElement>("[data-copy-code]");
      const code = button?.parentElement?.querySelector("pre");
      if (!button || !code) return;
      try {
        await navigator.clipboard.writeText(code.innerText);
      } catch {
        return; // clipboard unavailable
      }
      button.dataset.copied = "";
      setMessage(copiedLabel);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.querySelectorAll<HTMLElement>("[data-copied]").forEach((el) => delete el.dataset.copied);
        setMessage("");
      }, 1800);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  }, [copiedLabel]);

  return <span role="status" className="sr-only">{message}</span>;
}
