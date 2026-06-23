import { Hero } from "@/components/sections/hero";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { getProducts } from "@/lib/get-products";
import { TrustBar } from "@/components/sections/trust-bar";
import { Solutions } from "@/components/sections/solutions";
import { FeatureSpotlight } from "@/components/sections/feature-spotlight";
import { Pillars } from "@/components/sections/pillars";
import { Results } from "@/components/sections/results";
import { Sectors } from "@/components/sections/sectors";
import { Partners } from "@/components/sections/partners";
import { Metrics } from "@/components/sections/metrics";
import { Process } from "@/components/sections/process";
import { CtaBanner } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { AvatarPromo } from "@/components/layout/avatar-promo";
import { homeFaqs } from "@/lib/content";

export default async function HomePage() {
  const featuredProducts = await getProducts();

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Carrusel de productos (gestionable desde el backend) */}
      <ProductCarousel items={featuredProducts} />

      {/* 3 — Empresas / tecnología que confían */}
      <TrustBar />

      {/* 3 — Soluciones Estratégicas */}
      <Solutions />

      {/* 4 — Ecosistemas Digitales Inteligentes */}
      <FeatureSpotlight
        eyebrow="Ecosistemas Digitales"
        title={
          <>
            Conectamos personas, procesos,{" "}
            <span className="text-gradient-brand">datos y tecnología</span>
          </>
        }
        description="Diseñamos ecosistemas donde cada parte de tu organización trabaja en sincronía: información en tiempo real, automatización inteligente y decisiones basadas en datos."
        bullets={[
          "Integración de sistemas y APIs",
          "Automatización con IA y RPA",
          "Datos unificados y en tiempo real",
          "Procesos conectados de extremo a extremo",
        ]}
        href="/ecosistemas-digitales"
        icon="Network"
        visual="orbit"
        image="/inicio/ecosistemas-digitales.png"
      />

      {/* 5 — Inteligencia Artificial Empresarial */}
      <FeatureSpotlight
        eyebrow="Inteligencia Artificial Empresarial"
        title={
          <>
            La IA que <span className="text-gradient-brand">trabaja por tu empresa</span>
          </>
        }
        description="Agentes inteligentes, asistentes virtuales y analítica avanzada que automatizan tareas, reducen errores y liberan a tu equipo para lo que realmente importa."
        bullets={[
          "Agentes y asistentes inteligentes",
          "Automatización de procesos",
          "Analítica predictiva",
          "Productividad aumentada",
        ]}
        href="/inteligencia-artificial"
        icon="BrainCircuit"
        visual="stream"
        image="/inicio/inteligencia-artificial.png"
        reverse
      />

      {/* 6 — Infraestructura Tecnológica */}
      <FeatureSpotlight
        eyebrow="Infraestructura de Redes"
        title={
          <>
            La base sólida que{" "}
            <span className="text-gradient-brand">sostiene tu operación</span>
          </>
        }
        description="Conectividad robusta y zero-touch, diseñada tras un entendimiento profundo de tu negocio para maximizar tu inversión y la experiencia de tus usuarios."
        bullets={[
          "Redes zero-touch e inteligentes",
          "Alta disponibilidad",
          "Seguridad por diseño",
          "Escalabilidad garantizada",
        ]}
        href="/infraestructura-de-redes"
        icon="Server"
        visual="grid"
        image="/inicio/infraestructura-de-redes.png"
      />

      {/* 7 — Ciberseguridad */}
      <FeatureSpotlight
        eyebrow="Ciberseguridad"
        title={
          <>
            Protegemos lo más valioso:{" "}
            <span className="text-gradient-brand">tu información</span>
          </>
        }
        description="En un entorno donde lo único constante es la evolución de las amenazas, diseñamos soluciones de seguridad precisas basadas en el análisis de tus riesgos reales."
        bullets={[
          "Seguridad de perímetro y endpoints",
          "Control de acceso",
          "Monitoreo de amenazas 24/7",
          "Cumplimiento normativo",
        ]}
        href="/ciberseguridad"
        icon="ShieldCheck"
        visual="shield"
        image="/inicio/ciberseguridad.png"
        reverse
      />

      {/* 8 — Cloud y Continuidad */}
      <FeatureSpotlight
        eyebrow="Cloud y Continuidad"
        title={
          <>
            Tu negocio, <span className="text-gradient-brand">siempre disponible</span>
          </>
        }
        description="Nube híbrida, respaldo y recuperación ante desastres para que tu operación nunca se detenga, sin importar lo que ocurra."
        bullets={[
          "Nube híbrida y multi-cloud",
          "Respaldo automatizado",
          "Recuperación ante desastres",
          "Alta disponibilidad",
        ]}
        href="/cloud-continuidad"
        icon="Cloud"
        visual="orbit"
        image="/inicio/cloud-continuidad.png"
      />

      {/* 9 — Pilares / Por qué HISTECH */}
      <Pillars />

      {/* 10 — Resultados Reales */}
      <Results />

      {/* 11 — Sectores */}
      <Sectors />

      {/* 12 — Partners */}
      <Partners />

      {/* 13 — Indicadores */}
      <Metrics />

      {/* 14 — Proceso */}
      <Process />

      {/* FAQ (SEO) */}
      <Faq items={homeFaqs} />

      {/* 15 — CTA Final */}
      <CtaBanner />

      {/* Avatar corporativo flotante (carga diferida, solo home) */}
      <AvatarPromo />
    </>
  );
}
