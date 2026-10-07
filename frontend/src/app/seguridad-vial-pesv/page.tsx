import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["seguridad-vial-pesv"];

export const metadata = buildMetadata({
  title: data.metaTitle ?? data.name,
  description: data.metaDescription ?? data.subtitle,
  path: `/${data.slug}`,
  keywords: ["software PESV", "inspección preoperacional digital", "cumplimiento PESV", "normativa seguridad vial Colombia", "plan estratégico de seguridad vial"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
