import { rssFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  return rssFeed("fa");
}
