/**
 * Casos de éxito de HISTECH (anónimos, por tipo de impacto).
 *
 * Basados en proyectos reales documentados en la presentación
 * "Ecosistemas Digitales Inteligentes". Estructura Reto → Solución → Resultado
 * (AS IS / TO DO / TO BE), ideal para AEO/GEO: las IA valoran el "lo hemos hecho".
 */

export type CaseStudy = {
  slug: string;
  /** Título orientado al impacto. */
  title: string;
  category: string;
  icon: string;
  /** El reto (AS IS). */
  challenge: string;
  /** La solución técnica (TO DO). */
  solution: string;
  /** El resultado (TO BE). */
  result: string;
  /** Métrica destacada. */
  metric: string;
  metricLabel: string;
  /** Tecnologías aplicadas (credibilidad + citabilidad). */
  tech: string[];
  /** Servicios HISTECH relacionados (interlinking). */
  relatedServices: string[];
};

export const cases: CaseStudy[] = [
  {
    slug: "cero-errores-comunicaciones-financieras",
    title: "Cero errores en comunicaciones financieras",
    category: "Automatización financiera",
    icon: "Calculator",
    challenge:
      "Riesgo operativo y lentitud por la redacción y el envío manual de más de 4.000 comunicaciones a clientes, con alto potencial de error humano.",
    solution:
      "Desarrollo de bots RPA y un motor de renderizado de PDF concurrente, con distribución encriptada y registro completo de logs para auditoría.",
    result:
      "Un ecosistema seguro, instantáneo y sin errores que liberó al talento humano para enfocarse en el análisis de crédito y la atención estratégica.",
    metric: "Cero",
    metricLabel: "errores en 4.000+ comunicaciones",
    tech: ["RPA", "Renderizado PDF concurrente", "Cifrado", "Logs de auditoría"],
    relatedServices: ["automatizacion-empresarial", "inteligencia-artificial", "ciberseguridad"],
  },
  {
    slug: "inteligencia-operativa-decisiones-proactivas",
    title: "Decisiones proactivas con inteligencia operativa",
    category: "Inteligencia operativa",
    icon: "Activity",
    challenge:
      "Información fragmentada, reportes tardíos y ceguera operativa ante anomalías críticas del negocio.",
    solution:
      "Orquestación robótica (UiPath) con lógicas de negocio condicionales y notificaciones multicanal automatizadas mediante webhooks.",
    result:
      "Visibilidad total en tiempo real, con alertas push que se disparan únicamente cuando los KPIs exigen atención.",
    metric: "Tiempo real",
    metricLabel: "para decidir y actuar",
    tech: ["UiPath", "Webhooks", "Alertas multicanal", "Lógicas condicionales"],
    relatedServices: ["inteligencia-artificial", "ecosistemas-digitales", "automatizacion-empresarial"],
  },
  {
    slug: "aceleracion-flujo-de-caja",
    title: "Aceleración del flujo de caja",
    category: "Integración de sistemas",
    icon: "TrendingUp",
    challenge:
      "Desconexión entre el piso de producción y finanzas, que causaba tiempos muertos y discrepancias en la facturación.",
    solution:
      "Integración API bidireccional (del sistema MES a Facturación) con bases de datos PostgreSQL y triggers por cambio de estado.",
    result:
      "Facturación Zero-Touch instantánea al finalizar los servicios, transparentando las conciliaciones financieras.",
    metric: "Zero-Touch",
    metricLabel: "facturación instantánea",
    tech: ["API bidireccional", "MES", "PostgreSQL", "Triggers"],
    relatedServices: ["ecosistemas-digitales", "automatizacion-empresarial", "cloud-continuidad"],
  },
  {
    slug: "escala-masiva-sin-esfuerzo-humano",
    title: "Escala masiva sin esfuerzo humano",
    category: "Datos y escalabilidad",
    icon: "Server",
    challenge:
      "Metadatos web de miles de emisoras globales dispersos, caóticos e imposibles de auditar manualmente.",
    solution:
      "Algoritmos de data scraping masivo (Python/Node.js) combinados con una arquitectura backend concurrente sin latencia y optimización SEO.",
    result:
      "Un directorio en streaming centralizado operando 24/7, con más de 21.000 estaciones en alta disponibilidad en 27 países.",
    metric: "+21.000",
    metricLabel: "estaciones en 27 países",
    tech: ["Python", "Node.js", "Data scraping", "Arquitectura concurrente", "SEO"],
    relatedServices: ["desarrollo-software-colombia", "ecosistemas-digitales", "cloud-continuidad"],
  },
  {
    slug: "conexion-inmediata-dispara-conversiones",
    title: "Conexión inmediata que dispara conversiones",
    category: "Plataformas digitales",
    icon: "Target",
    challenge:
      "Mercado local hiper-fragmentado que generaba fricción, desconfianza y pérdida de ventas urgentes.",
    solution:
      "Arquitectura full-stack relacional (Prisma/Next.js) con backend en NestJS para matchmaking geolocalizado entre demanda y proveedores.",
    result:
      "Un hub digital centralizado en más de 1.122 municipios que conecta la demanda con proveedores verificados al instante.",
    metric: "1.122+",
    metricLabel: "municipios conectados",
    tech: ["Next.js", "NestJS", "Prisma", "Geolocalización"],
    relatedServices: ["desarrollo-software-colombia", "ecosistemas-digitales", "soluciones-web"],
  },
];

export const caseSlugs = cases.map((c) => c.slug);
