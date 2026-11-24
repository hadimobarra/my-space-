import { WeeksPage, weeksMetadata } from "@/components/pages/garden-pages";

export const metadata = weeksMetadata("en");

export default function Page() {
  return <WeeksPage locale="en" />;
}
