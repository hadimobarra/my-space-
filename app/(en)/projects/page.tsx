import { ProjectsIndexPage, projectsIndexMetadata } from "@/components/pages/projects-index-page";

export const metadata = projectsIndexMetadata("en");

export default function Page() {
  return <ProjectsIndexPage locale="en" />;
}
