"use client";

import { useSyncExternalStore } from "react";
import { fill } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

const DAY = 24 * 60;

const noSubscription = () => () => {};

/** My working hours translated to the visitor's time zone. Renders after hydration, when the zone is known. */
export function Overlap({ labels, locale }: { labels: { yourTime: string; overlap: string; sameZone: string; noOverlap: string }; locale: string }) {
  const visitorOffset = useSyncExternalStore(noSubscription, () => -new Date().getTimezoneOffset(), () => null);
  if (visitorOffset === null) return null;

  const { startHour, endHour, utcOffsetMinutes } = siteConfig.workingHours;
  if (visitorOffset === utcOffsetMinutes) return <>{labels.sameZone}</>;

  const shift = visitorOffset - utcOffsetMinutes;
  const start = startHour * 60 + shift;
  const end = endHour * 60 + shift;
  // Compare against the visitor's previous, current and next 09:00–18:00 day
  const overlap = [-DAY, 0, DAY].reduce((sum, day) => sum + Math.max(0, Math.min(end, 18 * 60 + day) - Math.max(start, 9 * 60 + day)), 0);

  const clock = (minutes: number) =>
    new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(
      new Date(Date.UTC(2000, 0, 2, 0, minutes))
    );
  const hours = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 }).format(overlap / 60);

  return (
    <>
      {labels.yourTime}: <bdi>{clock(start)}–{clock(end)}</bdi>
      <br />
      {overlap > 0 ? fill(labels.overlap, { hours }) : labels.noOverlap}
    </>
  );
}
