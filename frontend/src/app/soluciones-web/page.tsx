import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["soluciones-web"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["desarrollo web", "aplicaciones web", "Next.js", "React", "SEO técnico"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
