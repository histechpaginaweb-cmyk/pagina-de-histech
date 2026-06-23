import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactBlock } from "@/components/sections/contact-block";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contacto",
  description:
    "Hablemos sobre tu proyecto. Nuestros asesores especializados te contactarán para ayudarte a encontrar la mejor solución tecnológica.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-10 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Contacto", path: "/contacto" },
            ]}
          />
          <Reveal className="mt-8 max-w-2xl">
            <Badge>Contacto</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">Nuestros asesores te contactarán</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Estaremos encantados de responder tus preguntas y ayudarte a
              determinar cuál de nuestros servicios se adapta mejor a tus
              necesidades.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <ContactBlock />
      </Section>
    </>
  );
}
