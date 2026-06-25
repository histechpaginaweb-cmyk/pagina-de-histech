/**
 * SEO Local — páginas de cobertura geográfica de HISTECH.
 *
 * Estrategia híbrida: una página nacional (/colombia) + páginas regionales
 * prioritarias (/bogota, /cundinamarca). Cada página tiene contenido propio,
 * FAQs y contexto regional diferenciado (no duplicado) para SEO local.
 */

export type LocationContent = {
  slug: string;
  name: string;
  scope: "nacional" | "regional";
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Párrafos de introducción (únicos por ubicación). */
  intro: string[];
  highlights: { title: string; description: string; icon: string }[];
  /** Slugs de servicios destacados en esta página. */
  services: string[];
  /** Contexto regional diferencial. */
  context: { heading: string; body: string[] };
  faqs: { q: string; a: string }[];
  keywords: string[];
  /** Mostrar la dirección física (NAP) — solo donde HISTECH tiene sede. */
  showAddress: boolean;
};

export const locationsContent: Record<string, LocationContent> = {
  colombia: {
    slug: "colombia",
    name: "Colombia",
    scope: "nacional",
    eyebrow: "Cobertura nacional",
    title: "Soluciones tecnológicas para empresas en Colombia",
    subtitle:
      "Transformación digital, inteligencia artificial, ciberseguridad y desarrollo de software para empresas colombianas, con cobertura en todo el país.",
    intro: [
      "HISTECH acompaña la evolución tecnológica de empresas en toda Colombia. Combinamos un equipo local con alianzas de fabricantes globales para implementar infraestructura, ciberseguridad, cloud, automatización e inteligencia artificial donde tu organización lo necesite.",
      "Nuestro modelo de trabajo es híbrido: operamos de forma remota para la mayoría de los proyectos y nos desplazamos a sitio cuando el alcance lo requiere, lo que nos permite atender empresas desde las principales ciudades hasta operaciones en regiones apartadas.",
    ],
    highlights: [
      { title: "Cobertura en todo el país", description: "Atendemos empresas en las principales ciudades y regiones de Colombia.", icon: "Network" },
      { title: "Equipo local", description: "Profesionales que entienden el contexto y la realidad de la empresa colombiana.", icon: "HeartHandshake" },
      { title: "Alianzas globales", description: "Trabajamos con líderes como AWS, Microsoft, Cisco y más, con respaldo en Colombia.", icon: "Award" },
      { title: "Soporte remoto y en sitio", description: "Modelo híbrido que combina eficiencia remota con presencia cuando se necesita.", icon: "Settings2" },
    ],
    services: [
      "transformacion-digital",
      "inteligencia-artificial",
      "automatizacion-empresarial",
      "ciberseguridad",
      "desarrollo-software-colombia",
    ],
    context: {
      heading: "Transformación digital en Colombia",
      body: [
        "Las empresas colombianas enfrentan el reto de modernizarse en un entorno cada vez más competitivo y exigente en seguridad. La adopción de inteligencia artificial, la automatización de procesos y la protección de datos dejaron de ser opcionales para convertirse en condiciones de supervivencia y crecimiento.",
        "HISTECH ayuda a cerrar esa brecha con soluciones a la medida, alineadas con la normativa colombiana de protección de datos (Ley 1581 de 2012) y con las mejores prácticas internacionales, para que cada inversión tecnológica se traduzca en resultados medibles.",
      ],
    },
    faqs: [
      { q: "¿HISTECH atiende empresas en toda Colombia?", a: "Sí. Operamos con un modelo híbrido: la mayoría de los proyectos se ejecutan de forma remota y nos desplazamos a sitio cuando el alcance lo requiere, lo que nos permite atender empresas en todo el país." },
      { q: "¿Qué servicios tecnológicos ofrecen a nivel nacional?", a: "Transformación digital, inteligencia artificial, automatización de procesos, ciberseguridad, cloud, infraestructura de redes, cómputo y desarrollo de software a la medida." },
      { q: "¿Trabajan con empresas de cualquier tamaño?", a: "Sí. Diseñamos soluciones escalables, desde pymes en crecimiento hasta organizaciones con operaciones complejas en varios departamentos del país." },
    ],
    keywords: [
      "soluciones tecnológicas en Colombia",
      "transformación digital en Colombia",
      "inteligencia artificial para empresas colombianas",
      "desarrollo de software en Colombia",
      "ciberseguridad empresarial en Colombia",
    ],
    showAddress: false,
  },

  bogota: {
    slug: "bogota",
    name: "Bogotá",
    scope: "regional",
    eyebrow: "Bogotá D.C.",
    title: "Transformación digital y tecnología para empresas en Bogotá",
    subtitle:
      "Somos una empresa de tecnología con sede en Bogotá: infraestructura, ciberseguridad, IA y desarrollo de software con soporte remoto y en sitio.",
    intro: [
      "HISTECH tiene su sede en Bogotá, desde donde acompañamos a empresas de la ciudad en su transformación digital. Nuestra presencia local nos permite ofrecer soporte en sitio ágil, reuniones presenciales y un conocimiento cercano del mercado bogotano.",
      "Desde la capital atendemos a organizaciones de sectores como servicios financieros, salud, retail, manufactura y sector público, con soluciones de infraestructura, ciberseguridad, cloud, automatización e inteligencia artificial.",
    ],
    highlights: [
      { title: "Sede en Bogotá", description: "Presencia física en la ciudad para atención cercana y soporte en sitio.", icon: "Building2" },
      { title: "Soporte en sitio ágil", description: "Cuando se requiere presencia, llegamos rápido a tu operación en Bogotá.", icon: "Settings2" },
      { title: "Conocimiento del mercado", description: "Entendemos la realidad y los retos de las empresas bogotanas.", icon: "Target" },
      { title: "Atención a múltiples sectores", description: "Finanzas, salud, retail, manufactura y sector público, entre otros.", icon: "Briefcase" },
    ],
    services: [
      "ciberseguridad",
      "infraestructura-de-redes",
      "managed-services",
      "inteligencia-artificial",
      "desarrollo-software-colombia",
    ],
    context: {
      heading: "Tecnología para empresas en Bogotá",
      body: [
        "Bogotá concentra buena parte de la actividad empresarial y financiera del país, lo que la convierte también en un foco de exigencia tecnológica y de ciberamenazas. Las empresas de la capital necesitan infraestructura confiable, ciberseguridad sólida y procesos automatizados para mantenerse competitivas.",
        "Como empresa local, HISTECH combina la cercanía del soporte en sitio con la eficiencia del trabajo remoto, garantizando continuidad operativa y acompañamiento experto para las organizaciones bogotanas.",
      ],
    },
    faqs: [
      { q: "¿Dónde está ubicada HISTECH en Bogotá?", a: "Nuestra sede está en la Calle 116 # 70D-06, Oficina 301, en Bogotá D.C. Desde allí atendemos a empresas de la ciudad con soporte remoto y en sitio." },
      { q: "¿Ofrecen soporte presencial en Bogotá?", a: "Sí. Al tener sede en la ciudad, ofrecemos atención en sitio ágil para los proyectos que lo requieren, además del soporte remoto." },
      { q: "¿Qué empresas atienden en Bogotá?", a: "Trabajamos con organizaciones de distintos sectores y tamaños en Bogotá: servicios financieros, salud, retail, manufactura, sector público y más." },
    ],
    keywords: [
      "empresa de tecnología en Bogotá",
      "transformación digital Bogotá",
      "ciberseguridad empresas Bogotá",
      "desarrollo de software Bogotá",
      "soporte de TI Bogotá",
    ],
    showAddress: true,
  },

  cundinamarca: {
    slug: "cundinamarca",
    name: "Cundinamarca",
    scope: "regional",
    eyebrow: "Cundinamarca",
    title: "Soluciones tecnológicas para empresas en Cundinamarca",
    subtitle:
      "Tecnología, automatización y ciberseguridad para empresas e industrias de Cundinamarca, con la cercanía de un aliado basado en la región.",
    intro: [
      "Desde Bogotá, HISTECH atiende a empresas de todo Cundinamarca, incluyendo municipios como Chía, Cajicá, Zipaquirá, Soacha, Mosquera, Funza y Facatativá. Nuestra cercanía geográfica facilita el soporte en sitio y el acompañamiento a las operaciones de la región.",
      "Cundinamarca alberga importantes zonas industriales, agroindustriales y logísticas. Ayudamos a estas empresas a conectar su operación, proteger su infraestructura y automatizar sus procesos para competir con mayor eficiencia.",
    ],
    highlights: [
      { title: "Cercanía regional", description: "Atención a municipios de Cundinamarca con soporte en sitio desde Bogotá.", icon: "Network" },
      { title: "Enfoque industrial", description: "Experiencia con operaciones de manufactura, agroindustria y logística.", icon: "Factory" },
      { title: "Conectividad multi-sede", description: "Conectamos plantas, bodegas y oficinas de forma segura y estable.", icon: "Server" },
      { title: "Automatización de procesos", description: "Eliminamos tareas manuales en operaciones distribuidas.", icon: "Workflow" },
    ],
    services: [
      "infraestructura-de-redes",
      "ciberseguridad",
      "automatizacion-empresarial",
      "cloud-continuidad",
      "ecosistemas-digitales",
    ],
    context: {
      heading: "Tecnología para la industria de Cundinamarca",
      body: [
        "Cundinamarca es uno de los departamentos con mayor actividad industrial, agroindustrial y logística del país. Estas operaciones, muchas veces distribuidas en varias sedes, necesitan conectividad confiable, ciberseguridad industrial y automatización para reducir tiempos muertos y errores.",
        "HISTECH acompaña a las empresas de la región con soluciones diseñadas para entornos productivos: redes robustas, integración de sistemas y automatización que mejora la eficiencia sin detener la operación.",
      ],
    },
    faqs: [
      { q: "¿HISTECH atiende municipios de Cundinamarca?", a: "Sí. Desde Bogotá atendemos a empresas en municipios como Chía, Cajicá, Zipaquirá, Soacha, Mosquera, Funza y Facatativá, con soporte remoto y en sitio." },
      { q: "¿Tienen experiencia con empresas industriales?", a: "Sí. Trabajamos con operaciones de manufactura, agroindustria y logística, integrando planta y sistemas, protegiendo la infraestructura y automatizando procesos." },
      { q: "¿Pueden conectar varias sedes en la región?", a: "Sí. Diseñamos conectividad multi-sede segura y estable para unir plantas, bodegas y oficinas como una sola red confiable." },
    ],
    keywords: [
      "soluciones tecnológicas Cundinamarca",
      "tecnología para industria Cundinamarca",
      "ciberseguridad empresas Cundinamarca",
      "automatización industrial Cundinamarca",
      "infraestructura de redes Cundinamarca",
    ],
    showAddress: false,
  },
};

export const locationSlugs = Object.keys(locationsContent);
