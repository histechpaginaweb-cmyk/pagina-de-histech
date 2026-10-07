import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["teltonika-colombia"];

export const metadata = buildMetadata({
  title: data.metaTitle ?? data.name,
  description: data.metaDescription ?? data.subtitle,
  path: `/${data.slug}`,
  keywords: ["distribuidor Teltonika Colombia", "vendedor Teltonika", "router 4G", "router 4G industrial", "router LTE empresarial Bogotá", "Teltonika RMS"],
});

export default function Page() {
  return <ServicePage data={data} />;
}
