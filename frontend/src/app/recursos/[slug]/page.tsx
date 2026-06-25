import { notFound } from "next/navigation";
import { GuidePage } from "@/components/templates/guide-page";
import { buildMetadata } from "@/lib/seo";
import { guides, guideSlugs } from "@/lib/resources-content";

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides[slug];
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.description,
    path: `/recursos/${guide.slug}`,
    keywords: guide.keywords,
  });
}

export default async function GuideRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides[slug];
  if (!guide) notFound();
  return <GuidePage data={guide} />;
}
