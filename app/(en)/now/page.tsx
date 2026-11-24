import { NowPage, nowMetadata } from "@/components/pages/now-page";

export const metadata = nowMetadata("en");

export default function Page() {
  return <NowPage locale="en" />;
}
