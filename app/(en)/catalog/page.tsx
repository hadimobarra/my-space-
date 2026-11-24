import { CatalogPage, catalogMetadata } from "@/components/pages/trust-pages";

export const metadata = catalogMetadata("en");

export default function Page() {
  return <CatalogPage locale="en" />;
}
