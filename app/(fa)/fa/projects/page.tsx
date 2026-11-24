import { ProjectsIndexPage, projectsIndexMetadata } from "@/components/pages/projects-index-page";

export const metadata = projectsIndexMetadata("fa");

export default function Page() {
  return <ProjectsIndexPage locale="fa" />;
}
