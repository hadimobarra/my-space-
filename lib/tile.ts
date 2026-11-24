import { hash } from "./cover";

/*
 * Star patterns in the tradition of Persian tilework, generated from a slug.
 * Each regular polygon of a tiling gets a star: two lines leave the middle of every edge at
 * the same angle and meet their neighbours ("polygons in contact", E. H. Hankin).
 */

interface Polygon {
  n: number;
  x: number;
  y: number;
  radius: number;
  rotation: number;
  accent?: boolean;
}

const palettes = [
  { name: "lajvard", base: "#143a7b", star: "#f4efe2", accent: "#1fa3a0", line: "#d8a53f" },
  { name: "firuzeh", base: "#0c7a83", star: "#f6f1e4", accent: "#17336b", line: "#e3b552" },
  { name: "shab", base: "#0d1f45", star: "#2fb1ad", accent: "#e8dcc0", line: "#c98f35" },
  { name: "khesht", base: "#7d332b", star: "#f2e4c9", accent: "#1f6f7a", line: "#1b2f5c" },
  { name: "esfahan", base: "#1a5d80", star: "#f7f2e4", accent: "#e9b949", line: "#0c2747" },
  { name: "zomorrod", base: "#14604f", star: "#f3ecd9", accent: "#cf8a2e", line: "#0b2f3a" },
] as const;

const octSide = Math.SQRT2 - 1;
const hexHeight = Math.sqrt(3);

const tilings: { width: number; height: number; polygons: Polygon[] }[] = [
  {
    // Octagons and squares (4.8.8)
    width: 1,
    height: 1,
    polygons: [
      { n: 8, x: 0.5, y: 0.5, radius: octSide / (2 * Math.sin(Math.PI / 8)), rotation: Math.PI / 8 },
      ...[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => ({ n: 4, x, y, radius: octSide / Math.SQRT2, rotation: 0, accent: true })),
    ],
  },
  ...[
    // Hexagons (6.6.6) and dodecagons (3.12.12) share one lattice
    { n: 6, radius: 1 / Math.sqrt(3), rotation: Math.PI / 6 },
    { n: 12, radius: 0.5 / Math.cos(Math.PI / 12), rotation: Math.PI / 12 },
  ].map(({ n, radius, rotation }) => ({
    width: 1,
    height: hexHeight,
    polygons: [[0, 0], [1, 0], [0.5, hexHeight / 2], [0, hexHeight], [1, hexHeight]].map(([x, y], i) => ({ n, x, y, radius, rotation, accent: i === 2 && n === 6 })),
  })),
];

const point = (p: Polygon, r: number, angle: number) => `${((p.x + r * Math.cos(angle)) * 100).toFixed(2)} ${((p.y + r * Math.sin(angle)) * 100).toFixed(2)}`;

function starPath(p: Polygon, contact: number) {
  const apothem = p.radius * Math.cos(Math.PI / p.n);
  const inner = (apothem * Math.cos(contact)) / Math.cos(contact - Math.PI / p.n);
  const points: string[] = [];
  for (let k = 0; k < p.n; k++) {
    points.push(point(p, apothem, p.rotation + ((2 * k + 1) * Math.PI) / p.n), point(p, inner, p.rotation + ((2 * k + 2) * Math.PI) / p.n));
  }
  return `M${points.join("L")}Z`;
}

function pattern(slug: string) {
  const h = hash(slug);
  const colors = palettes[h % palettes.length];
  const tiling = tilings[(h >> 4) % tilings.length];
  const contact = ((52 + ((h >> 8) % 4) * 5) * Math.PI) / 180;
  const paths = tiling.polygons
    .map((p) => `<path d="${starPath(p, contact)}" fill="${p.accent ? colors.accent : colors.star}" stroke="${colors.line}" stroke-width="2"/>`)
    .join("");
  // A smaller star inside the large ones, as in tile mosaics
  const inlay = tiling.polygons
    .filter((p) => p.n > 4)
    .map((p) => `<path d="${starPath({ ...p, radius: p.radius * 0.45 }, contact)}" fill="${p.accent ? colors.star : colors.base}"/>`)
    .join("");
  return { colors, width: tiling.width * 100, height: tiling.height * 100, body: `<rect width="100%" height="100%" fill="${colors.base}"/>${paths}${inlay}` };
}

/** One repeatable unit as a data URI, with its size, for CSS backgrounds. */
export function tileBackground(slug: string, unit = 72) {
  const { width, height, body, colors } = pattern(slug);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height.toFixed(3)}" width="${width}" height="${height.toFixed(3)}">${body}</svg>`;
  return {
    color: colors.base,
    image: `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, " ").replace(/%3D/g, "=").replace(/%3A/g, ":").replace(/%2F/g, "/").replace(/%22/g, "'")}")`,
    size: `${unit}px ${((unit * height) / width).toFixed(2)}px`,
  };
}

/** A full panel of the pattern, for social images. */
export function tilePanel(slug: string, width: number, height: number, unit = 120) {
  const p = pattern(slug);
  const scale = unit / p.width;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><pattern id="t" width="${p.width}" height="${p.height}" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})">${p.body}</pattern></defs><rect width="${width}" height="${height}" fill="url(#t)"/></svg>`;
}
