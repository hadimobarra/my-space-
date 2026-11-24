import { SeriesPage, seriesMetadata } from "@/components/pages/blog-collections";
import { seriesSlugs } from "@/lib/series";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return seriesSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return seriesMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <SeriesPage slug={(await params).slug} />;
}
