import { Section, Container } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Política de Privacidad",
  description:
    "Política de tratamiento de datos personales de HISTECH Tecnología conforme a la Ley 1581 de 2012 de Colombia.",
  path: "/privacidad",
});

export default function PrivacyPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden pb-8 pt-32 sm:pt-40">
        <Aurora variant="soft" />
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Política de Privacidad", path: "/privacidad" },
            ]}
          />
          <Reveal className="mt-8">
            <h1 className="text-display-lg">Política de Privacidad</h1>
            <p className="mt-4 text-muted-foreground">
              Última actualización: enero de 2026
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-4">
        <Container className="max-w-3xl space-y-6 text-foreground/85 leading-relaxed">
          <p>
            En {siteConfig.legalName} valoramos y protegemos la privacidad de
            nuestros usuarios y clientes. Esta política describe cómo
            recolectamos, usamos y protegemos tus datos personales, en
            cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la
            República de Colombia.
          </p>

          <Legal h="1. Responsable del tratamiento">
            {siteConfig.legalName}, con domicilio en {siteConfig.contact.address},{" "}
            {siteConfig.contact.city}, es responsable del tratamiento de los
            datos personales recolectados a través de este sitio web. Para
            cualquier consulta, escríbenos a {siteConfig.contact.email}.
          </Legal>

          <Legal h="2. Datos que recolectamos">
            Recolectamos los datos que nos proporcionas voluntariamente a través
            de nuestros formularios: nombre, apellido, empresa, correo
            electrónico, número de teléfono y el contenido de tus mensajes.
          </Legal>

          <Legal h="3. Finalidad del tratamiento">
            Utilizamos tus datos para responder a tus solicitudes, brindarte
            información sobre nuestros servicios, agendar reuniones y dar
            seguimiento comercial. No compartimos tu información con terceros
            con fines publicitarios.
          </Legal>

          <Legal h="4. Tus derechos">
            Como titular de los datos, tienes derecho a conocer, actualizar,
            rectificar y suprimir tus datos personales, así como a revocar la
            autorización otorgada. Puedes ejercer estos derechos escribiéndonos
            a {siteConfig.contact.email}.
          </Legal>

          <Legal h="5. Seguridad de la información">
            Implementamos medidas técnicas, administrativas y físicas para
            proteger tus datos contra acceso no autorizado, pérdida o
            alteración.
          </Legal>

          <Legal h="6. Cambios a esta política">
            Podemos actualizar esta política periódicamente. Publicaremos
            cualquier cambio en esta página con su respectiva fecha de
            actualización.
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
