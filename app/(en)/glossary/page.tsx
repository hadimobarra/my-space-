import { GlossaryPage, glossaryMetadata } from "@/components/pages/garden-pages";

export const metadata = glossaryMetadata("en");

export default function Page() {
  return <GlossaryPage locale="en" />;
}
