import { Section, Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso del sitio web de HISTECH Tecnología.",
  path: "/terminos",
});

export default function TermsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-8 pt-32 sm:pt-40">
        <Aurora variant="soft" />
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Términos y Condiciones", path: "/terminos" },
            ]}
          />
          <Reveal className="mt-8">
            <h1 className="text-display-lg">Términos y Condiciones</h1>
            <p className="mt-4 text-muted-foreground">
              Última actualización: enero de 2026
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-4">
        <Container className="max-w-3xl space-y-6 text-foreground/85 leading-relaxed">
          <p>
            Bienvenido al sitio web de {siteConfig.legalName}. Al acceder y
            utilizar este sitio, aceptas los siguientes términos y condiciones.
          </p>

          <Legal h="1. Uso del sitio">
            Este sitio web tiene fines informativos sobre los servicios de{" "}
            {siteConfig.legalName}. Te comprometes a utilizarlo de manera lícita
            y a no realizar actividades que puedan dañar, deshabilitar o
            sobrecargar el sitio.
          </Legal>

          <Legal h="2. Propiedad intelectual">
            Todo el contenido de este sitio —textos, gráficos, logotipos,
            iconos e imágenes— es propiedad de {siteConfig.legalName} o de sus
            licenciantes y está protegido por las leyes de propiedad
            intelectual.
          </Legal>

          <Legal h="3. Servicios">
            La información sobre servicios presentada en este sitio es de
            carácter general y no constituye una oferta contractual vinculante.
            Las condiciones específicas de cada servicio se acuerdan mediante
            una propuesta comercial formal.
          </Legal>

          <Legal h="4. Limitación de responsabilidad">
            {siteConfig.legalName} no será responsable por daños derivados del
            uso o la imposibilidad de uso de este sitio web, en la máxima medida
            permitida por la ley aplicable.
          </Legal>

          <Legal h="5. Enlaces a terceros">
            Este sitio puede contener enlaces a sitios de terceros. No somos
            responsables del contenido ni de las prácticas de privacidad de
            dichos sitios.
          </Legal>

          <Legal h="6. Ley aplicable">
            Estos términos se rigen por las leyes de la República de Colombia.
            Cualquier controversia se resolverá ante los tribunales competentes
            de Bogotá D.C.
          </Legal>
        </Container>
      </Section>
    </>
  );
}

function Legal({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-foreground">{h}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}
