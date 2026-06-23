import { Section, Container, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PartnerLogo } from "@/components/sections/partner-logo";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { partnersByCategory } from "@/lib/partners";

export const metadata = buildMetadata({
  title: "Aliados Tecnológicos",
  description:
    "Trabajamos con los fabricantes y plataformas líderes del mundo: AWS, Microsoft, Google Cloud, Cisco, VMware, Veeam, Fortinet y más.",
  path: "/aliados",
});

export default function PartnersPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Aliados", path: "/aliados" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Aliados Tecnológicos</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">Avalado por los mejores</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              No improvisamos. Trabajamos únicamente con fabricantes y
              plataformas líderes para garantizar la calidad, el rendimiento y
              el respaldo de cada solución que entregamos.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          <div className="space-y-12">
            {partnersByCategory.map((row) => (
              <Reveal key={row.category}>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-cyan/80">
                  {row.category}
                </h2>
                <RevealStagger className="mt-5 flex flex-wrap gap-4">
                  {row.items.map((p) => (
                    <PartnerLogo key={p.name} partner={p} />
                  ))}
                </RevealStagger>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
