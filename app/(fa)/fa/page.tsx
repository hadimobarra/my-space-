import { HomePage, homeMetadata } from "@/components/pages/home-page";

export const metadata = homeMetadata("fa");

export default function Page() {
  return <HomePage locale="fa" />;
}
