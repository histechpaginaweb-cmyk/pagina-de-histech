import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["automatizacion-empresarial"];

export const metadata = buildMetadata({
  title: data.metaTitle ?? data.name,
  description: data.metaDescription ?? data.subtitle,
  path: `/${data.slug}`,
  keywords: [
    "automatización empresarial",
    "automatización de procesos",
    "RPA Colombia",
    "automatización con inteligencia artificial",
    "automatización de procesos para empresas",
  ],
});

export default function Page() {
  return <ServicePage data={data} />;
}
