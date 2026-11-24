import { ProjectPage, projectMetadata } from "@/components/pages/project-page";
import { getProjectSlugs } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return projectMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ProjectPage locale="en" slug={(await params).slug} />;
}
