import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["ecosistemas-digitales"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["ecosistemas digitales", "integración de sistemas", "APIs", "RPA", "automatización"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
