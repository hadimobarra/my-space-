import { GlossaryPage, glossaryMetadata } from "@/components/pages/garden-pages";

export const metadata = glossaryMetadata("fa");

export default function Page() {
  return <GlossaryPage locale="fa" />;
}
