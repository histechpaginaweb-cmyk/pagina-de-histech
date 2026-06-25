import { ServicePage } from "@/components/templates/service-page";
import { buildMetadata } from "@/lib/seo";
import { servicesContent } from "@/lib/services-content";

const data = servicesContent["desarrollo-software-colombia"];

export const metadata = buildMetadata({
  title: "Desarrollo de Software a la Medida en Colombia",
  description: data.subtitle,
  path: `/${data.slug}`,
  keywords: [
    "desarrollo de software a la medida",
    "desarrollo de software Colombia",
    "software empresarial a medida",
    "desarrollo de aplicaciones web",
    "fábrica de software",
  ],
});

export default function Page() {
  return <ServicePage data={data} />;
}
