import { ResumePage, resumeMetadata } from "@/components/pages/resume-page";

export const metadata = resumeMetadata("en");

export default function Page() {
  return <ResumePage locale="en" />;
}
