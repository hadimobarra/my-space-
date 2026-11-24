import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./locale";

export interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
}

/** Short posts, newest first. File name: YYYY-MM-DD-some-id.md */
export function getNotes(locale: Locale): Note[] {
  const directory = path.join(process.cwd(), "content/notes", locale);
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(directory, f), "utf8"));
      return { id: f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, ""), title: data.title as string, date: data.date as string, content };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}
