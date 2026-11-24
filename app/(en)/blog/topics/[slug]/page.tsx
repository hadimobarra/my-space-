import { TopicPage, topicMetadata } from "@/components/pages/blog-collections";
import { getTopics } from "@/lib/topics";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getTopics().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return topicMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <TopicPage slug={(await params).slug} />;
}
