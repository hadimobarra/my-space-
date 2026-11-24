import { NowPage, nowMetadata } from "@/components/pages/now-page";

export const metadata = nowMetadata("fa");

export default function Page() {
  return <NowPage locale="fa" />;
}
