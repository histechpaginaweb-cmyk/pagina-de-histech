import { Check } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactBlock } from "@/components/sections/contact-block";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Agenda una Consultoría",
  description:
    "Agenda una consultoría sin costo con HISTECH. Diagnóstico tecnológico y una propuesta clara, medible y alineada con tus objetivos.",
  path: "/agenda-consultoria",
});

const promises = [
  "Diagnóstico tecnológico sin costo",
  "Asesores especializados, sin intermediarios",
  "Propuesta clara, medible y a la medida",
  "Sin compromiso ni letra pequeña",
];

export default function AgendaPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-10 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Agenda una consultoría", path: "/agenda-consultoria" },
            ]}
          />
          <Reveal className="mt-8 max-w-2xl">
            <Badge>Consultoría sin costo</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                El futuro tecnológico de tu empresa comienza aquí
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Cuéntanos sobre tu negocio y agenda una reunión con nuestros
              especialistas. Te escuchamos, diagnosticamos y diseñamos una
              propuesta a tu medida.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {promises.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-purple/20">
                    <Check className="size-3 text-brand-cyan" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <ContactBlock />
      </Section>
    </>
  );
}
