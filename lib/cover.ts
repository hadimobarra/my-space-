const palettes = [
  ["#2563eb", "#7c3aed", "#06b6d4"],
  ["#0ea5e9", "#22c55e", "#14b8a6"],
  ["#7c3aed", "#db2777", "#f97316"],
  ["#4f46e5", "#0891b2", "#10b981"],
  ["#f59e0b", "#ef4444", "#8b5cf6"],
  ["#0f766e", "#2563eb", "#9333ea"],
] as const;

export function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic cover colours, shared by on-page covers and social images. */
export function coverPalette(slug: string) {
  return palettes[hash(slug) % palettes.length];
}
