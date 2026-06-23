import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["transformacion-digital"];

export const metadata = buildMetadata({
  title: data.name,
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: ["transformación digital", "modernización empresarial", "innovación", "consultoría"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
