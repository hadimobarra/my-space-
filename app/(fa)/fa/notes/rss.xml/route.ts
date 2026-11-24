import { notesFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  return notesFeed("fa");
}
