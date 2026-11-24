import { ResumePage, resumeMetadata } from "@/components/pages/resume-page";

export const metadata = resumeMetadata("fa");

export default function Page() {
  return <ResumePage locale="fa" />;
}
