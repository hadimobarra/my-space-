"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const code = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

function send(path: string, event: boolean) {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (!code || nav.webdriver || nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
  const params = new URLSearchParams({ p: path, t: document.title, r: document.referrer });
  if (event) params.set("e", "true");
  navigator.sendBeacon(`https://${code}.goatcounter.com/count?${params}`);
}

/**
 * Cookie-free page and event counts (GoatCounter) without loading a third-party script.
 * Does nothing unless NEXT_PUBLIC_GOATCOUNTER_CODE is set, and skips automated browsers
 * and honours Do Not Track.
 * Events: any link or button with a data-track attribute.
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => send(pathname, false), [pathname]);

  useEffect(() => {
    if (!code) return;
    const onClick = (e: MouseEvent) => {
      const name = (e.target as Element | null)?.closest<HTMLElement>("[data-track]")?.dataset.track;
      if (name) send(name, true);
    };
    const onEvent = (e: Event) => send((e as CustomEvent<string>).detail, true);
    document.addEventListener("click", onClick);
    window.addEventListener("analytics", onEvent);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("analytics", onEvent);
    };
  }, []);

  return null;
}
