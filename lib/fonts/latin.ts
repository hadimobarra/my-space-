import { Geist, Geist_Mono } from "next/font/google";

// No preload: the bundler merges the CSS of both root layouts, so preloading would make every
// page fetch the other language's fonts too. Size-matched fallbacks keep the swap from shifting layout.
const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], preload: false });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });

export const latinFonts = `${sans.variable} ${mono.variable}`;
