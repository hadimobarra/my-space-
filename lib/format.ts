export function formatDate(date: string, locale: string = "en") {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function formatNumber(value: number, locale: string = "en") {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

/** For dates that are only known to the month. */
export function formatMonth(date: string, locale: string = "en") {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", { year: "numeric", month: "short", timeZone: "UTC" }).format(new Date(date));
}
