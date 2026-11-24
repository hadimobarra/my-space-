import { Geist_Mono, Vazirmatn } from "next/font/google";

const sans = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], preload: false });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });

export const persianFonts = `${sans.variable} ${mono.variable}`;
