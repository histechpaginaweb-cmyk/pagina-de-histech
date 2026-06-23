/** Contenido de cada página de industria, indexado por slug. */

export type IndustryContent = {
  slug: string;
  name: string;
  icon: string;
  title: string;
  subtitle: string;
  intro: string;
  challenges: string[];
  solutions: { service: string; slug: string }[];
  outcomes: { metric: string; label: string }[];
};

export const industriesContent: Record<string, IndustryContent> = {
  manufactura: {
    slug: "manufactura",
    name: "Manufactura",
    icon: "Factory",
    title: "Tecnología para una manufactura inteligente",
    subtitle:
      "Conectamos planta, procesos y datos para una operación más eficiente, segura y competitiva.",
    intro:
      "La industria 4.0 exige integrar IoT, automatización y analítica en tiempo real. Ayudamos a las empresas manufactureras a digitalizar su operación, proteger su infraestructura y tomar decisiones basadas en datos.",
    challenges: [
      "Procesos manuales y poco trazables",
      "Sistemas ERP y de planta desconectados",
      "Riesgos de ciberseguridad industrial (OT)",
      "Tiempos muertos por fallos de infraestructura",
    ],
    solutions: [
      { service: "Ecosistemas Digitales", slug: "ecosistemas-digitales" },
      { service: "Inteligencia Artificial", slug: "inteligencia-artificial" },
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Infraestructura de Redes", slug: "infraestructura-de-redes" },
    ],
    outcomes: [
      { metric: "-95%", label: "errores operativos" },
      { metric: "24/7", label: "monitoreo de planta" },
      { metric: "+ OEE", label: "eficiencia de equipos" },
    ],
  },
  salud: {
    slug: "salud",
    name: "Salud",
    icon: "HeartPulse",
    title: "Tecnología que cuida a quienes cuidan",
    subtitle:
      "Infraestructura segura, continuidad y telemedicina para instituciones de salud modernas.",
    intro:
      "El sector salud maneja datos sensibles y no puede permitirse interrupciones. Implementamos soluciones seguras, disponibles y conformes con la normativa para proteger la información clínica y habilitar la atención digital.",
    challenges: [
      "Protección de datos clínicos sensibles",
      "Cumplimiento normativo del sector",
      "Disponibilidad crítica de sistemas",
      "Habilitación de telemedicina",
    ],
    solutions: [
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
      { service: "Inteligencia Artificial", slug: "inteligencia-artificial" },
      { service: "Soluciones Web", slug: "soluciones-web" },
    ],
    outcomes: [
      { metric: "100%", label: "datos protegidos" },
      { metric: "Alta", label: "disponibilidad" },
      { metric: "+ acceso", label: "atención digital" },
    ],
  },
  "banca-seguros": {
    slug: "banca-seguros",
    name: "Banca y Seguros",
    icon: "Landmark",
    title: "Seguridad y automatización para el sector financiero",
    subtitle:
      "Ciberseguridad, cumplimiento y automatización inteligente para banca, seguros y fintech.",
    intro:
      "El sector financiero es uno de los más exigentes en seguridad, cumplimiento y disponibilidad. Diseñamos arquitecturas robustas y automatizamos procesos críticos manteniendo el control y la conformidad normativa.",
    challenges: [
      "Amenazas de ciberseguridad constantes",
      "Cumplimiento regulatorio exigente",
      "Procesos financieros manuales",
      "Necesidad de decisiones en tiempo real",
    ],
    solutions: [
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Inteligencia Artificial", slug: "inteligencia-artificial" },
      { service: "Ecosistemas Digitales", slug: "ecosistemas-digitales" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
    ],
    outcomes: [
      { metric: "-95%", label: "errores en procesos" },
      { metric: "100%", label: "cumplimiento" },
      { metric: "Tiempo real", label: "para decidir" },
    ],
  },
  "transporte-logistica": {
    slug: "transporte-logistica",
    name: "Transporte y Logística",
    icon: "Truck",
    title: "Conectividad y datos para una logística sin fricción",
    subtitle:
      "Trazabilidad, conectividad y automatización para operaciones logísticas de alto rendimiento.",
    intro:
      "La logística vive de la coordinación y la información en tiempo real. Integramos sistemas, conectamos operaciones y automatizamos procesos para acelerar tu cadena de valor.",
    challenges: [
      "Falta de trazabilidad en tiempo real",
      "Sistemas y canales desconectados",
      "Procesos administrativos lentos",
      "Conectividad en múltiples sedes",
    ],
    solutions: [
      { service: "Ecosistemas Digitales", slug: "ecosistemas-digitales" },
      { service: "Infraestructura de Redes", slug: "infraestructura-de-redes" },
      { service: "Inteligencia Artificial", slug: "inteligencia-artificial" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
    ],
    outcomes: [
      { metric: "− tiempos", label: "de gestión" },
      { metric: "+ visibilidad", label: "de operación" },
      { metric: "Conectividad", label: "multi-sede" },
    ],
  },
  educacion: {
    slug: "educacion",
    name: "Educación",
    icon: "GraduationCap",
    title: "Tecnología que potencia el aprendizaje",
    subtitle:
      "Plataformas, conectividad y colaboración para instituciones educativas modernas.",
    intro:
      "Las instituciones educativas necesitan plataformas confiables, conectividad robusta y herramientas de colaboración. Habilitamos entornos de aprendizaje digitales, seguros y escalables.",
    challenges: [
      "Plataformas educativas dispersas",
      "Conectividad insuficiente en campus",
      "Protección de datos de estudiantes",
      "Colaboración remota e híbrida",
    ],
    solutions: [
      { service: "Infraestructura de Redes", slug: "infraestructura-de-redes" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
      { service: "Soluciones Web", slug: "soluciones-web" },
      { service: "Ciberseguridad", slug: "ciberseguridad" },
    ],
    outcomes: [
      { metric: "+ acceso", label: "al aprendizaje" },
      { metric: "Colaboración", label: "híbrida" },
      { metric: "Datos", label: "protegidos" },
    ],
  },
  retail: {
    slug: "retail",
    name: "Retail",
    icon: "ShoppingBag",
    title: "Ecosistemas digitales para el retail moderno",
    subtitle:
      "Omnicanalidad, e-commerce y experiencias conectadas que aumentan tus conversiones.",
    intro:
      "El retail compite por experiencia. Conectamos tus canales de venta, atención y operación en un ecosistema digital que mejora la experiencia del cliente y aumenta la conversión.",
    challenges: [
      "Canales de venta desconectados",
      "Experiencia de cliente inconsistente",
      "Gestión manual de inventario y procesos",
      "Baja conversión digital",
    ],
    solutions: [
      { service: "Ecosistemas Digitales", slug: "ecosistemas-digitales" },
      { service: "Soluciones Web", slug: "soluciones-web" },
      { service: "Inteligencia Artificial", slug: "inteligencia-artificial" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
    ],
    outcomes: [
      { metric: "+ ventas", label: "y conversión" },
      { metric: "Omnicanal", label: "conectado" },
      { metric: "Mejor", label: "experiencia" },
    ],
  },
  "sector-publico": {
    slug: "sector-publico",
    name: "Sector Público",
    icon: "Building2",
    title: "Gobierno digital, eficiente y seguro",
    subtitle:
      "Modernización tecnológica, ciberseguridad y eficiencia operativa para entidades públicas.",
    intro:
      "Las entidades públicas necesitan modernizarse manteniendo la seguridad y la transparencia. Acompañamos la transformación digital del sector público con soluciones eficientes y conformes.",
    challenges: [
      "Procesos burocráticos y manuales",
      "Infraestructura tecnológica desactualizada",
      "Exigencias de seguridad y transparencia",
      "Atención ciudadana digital",
    ],
    solutions: [
      { service: "Transformación Digital", slug: "transformacion-digital" },
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Ecosistemas Digitales", slug: "ecosistemas-digitales" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
    ],
    outcomes: [
      { metric: "+ eficiencia", label: "operativa" },
      { metric: "Seguridad", label: "garantizada" },
      { metric: "Mejor", label: "atención ciudadana" },
    ],
  },
  consultoria: {
    slug: "consultoria",
    name: "Consultoría",
    icon: "Briefcase",
    title: "Infraestructura confiable para firmas de consultoría",
    subtitle:
      "Estabilidad, productividad y reducción de downtime para empresas de servicios profesionales.",
    intro:
      "Las firmas de consultoría dependen de la disponibilidad y la productividad. Aseguramos infraestructura estable, colaboración fluida y soporte continuo para que tu equipo nunca se detenga.",
    challenges: [
      "Downtime que afecta la facturación",
      "Necesidad de movilidad y colaboración",
      "Protección de información confidencial",
      "Soporte tecnológico ágil",
    ],
    solutions: [
      { service: "Servicios Gestionados", slug: "managed-services" },
      { service: "Infraestructura de Redes", slug: "infraestructura-de-redes" },
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
    ],
    outcomes: [
      { metric: "− downtime", label: "y pérdidas" },
      { metric: "24/7", label: "soporte" },
      { metric: "+ productividad", label: "del equipo" },
    ],
  },
  ong: {
    slug: "ong",
    name: "ONG",
    icon: "Heart",
    title: "Tecnología con impacto para organizaciones sociales",
    subtitle:
      "Soluciones escalables y económicas para que tu causa llegue más lejos.",
    intro:
      "Las organizaciones sin fines de lucro necesitan maximizar cada recurso. Diseñamos soluciones tecnológicas escalables y económicas que amplifican tu impacto social.",
    challenges: [
      "Presupuestos limitados",
      "Necesidad de escalar el impacto",
      "Protección de datos de beneficiarios",
      "Herramientas de colaboración accesibles",
    ],
    solutions: [
      { service: "Cloud y Continuidad", slug: "cloud-continuidad" },
      { service: "Soluciones Web", slug: "soluciones-web" },
      { service: "Ciberseguridad", slug: "ciberseguridad" },
      { service: "Consultoría en IT", slug: "consultoria-it" },
    ],
    outcomes: [
      { metric: "+ impacto", label: "social" },
      { metric: "Costos", label: "optimizados" },
      { metric: "Escalable", label: "y seguro" },
    ],
  },
};

export const industrySlugs = Object.keys(industriesContent);
