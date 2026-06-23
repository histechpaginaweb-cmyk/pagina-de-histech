/**
 * Contenido editorial reutilizable (resultados, métricas, proceso, partners, FAQs).
 * Separado de la UI para facilitar edición por marketing y reuso en varias páginas.
 */

export const metrics = [
  { value: "+25", label: "Clientes que confían en nosotros" },
  { value: "100%", label: "Satisfacción de clientes" },
  { value: "+40", label: "Soluciones tecnológicas" },
  { value: "24/7", label: "Monitoreo y soporte" },
] as const;

/** Resultados reales — casos anónimos por tipo de impacto. */
export const results = [
  {
    title: "Automatización Financiera",
    metric: "-95%",
    metricLabel: "errores operativos",
    description:
      "Automatización de validaciones, flujos documentales y procesos financieros críticos.",
    icon: "Calculator",
  },
  {
    title: "Inteligencia Operativa",
    metric: "Tiempo real",
    metricLabel: "para decidir",
    description:
      "Integración de datos para monitoreo, analítica y gestión estratégica proactiva.",
    icon: "Activity",
  },
  {
    title: "Ecosistemas Digitales",
    metric: "100%",
    metricLabel: "procesos conectados",
    description:
      "Orquestación de procesos mediante IA, APIs y RPA en un ecosistema unificado.",
    icon: "Network",
  },
  {
    title: "Escalabilidad Empresarial",
    metric: "+ capacidad",
    metricLabel: "sin más personal",
    description:
      "Arquitecturas con IA y automatización que crecen sin aumentar la complejidad.",
    icon: "TrendingUp",
  },
  {
    title: "Aceleración del Flujo de Caja",
    metric: "− tiempos",
    metricLabel: "de gestión",
    description:
      "Procesos comerciales y administrativos automatizados que aceleran la conversión.",
    icon: "Banknote",
  },
  {
    title: "Incremento de Conversiones",
    metric: "+ ventas",
    metricLabel: "y experiencia",
    description:
      "Ecosistemas digitales que conectan canales de venta, atención y comunicación.",
    icon: "Target",
  },
] as const;

/** Proceso comercial — 3 pasos. */
export const process = [
  {
    step: "01",
    title: "Agendamos una reunión",
    description:
      "Conversamos sobre tu negocio, tus retos y tus objetivos tecnológicos.",
  },
  {
    step: "02",
    title: "Nos reunimos y te escuchamos",
    description:
      "Realizamos un diagnóstico técnico y entendemos a fondo tus necesidades.",
  },
  {
    step: "03",
    title: "Diseñamos una propuesta",
    description:
      "Te entregamos una propuesta clara, medible y alineada con tu visión.",
  },
] as const;

/** Diferenciadores / por qué HISTECH. */
export const differentiators = [
  { title: "Orientado al cliente", icon: "HeartHandshake" },
  { title: "Personalizado", icon: "Settings2" },
  { title: "Asesores especializados", icon: "GraduationCap" },
  { title: "Transparencia total", icon: "Eye" },
] as const;

/** Sectores atendidos (home grid). */
export const sectors = [
  { label: "Manufactura", icon: "Factory", href: "/industrias/manufactura" },
  { label: "Salud", icon: "HeartPulse", href: "/industrias/salud" },
  { label: "Banca y Seguros", icon: "Landmark", href: "/industrias/banca-seguros" },
  { label: "Transporte y Logística", icon: "Truck", href: "/industrias/transporte-logistica" },
  { label: "Educación", icon: "GraduationCap", href: "/industrias/educacion" },
  { label: "Retail", icon: "ShoppingBag", href: "/industrias/retail" },
  { label: "Sector Público", icon: "Building2", href: "/industrias/sector-publico" },
  { label: "Consultoría", icon: "Briefcase", href: "/industrias/consultoria" },
  { label: "ONG", icon: "Heart", href: "/industrias/ong" },
] as const;

/** Partners tecnológicos por categoría. */
export const partners = {
  Cloud: ["AWS", "Microsoft Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud", "DigitalOcean"],
  "Microsoft 365": ["Microsoft 365", "Exchange Online", "SharePoint", "Defender 365", "Windows 365", "Autopilot"],
  "Redes & Seguridad": ["Cisco", "Sophos", "WatchGuard", "Extreme Networks", "Dell Technologies", "VMware"],
  "Backup & Recovery": ["Veeam", "Acronis", "Altaro", "Zerto"],
} as const;

/** Pilares estratégicos. */
export const pillars = [
  {
    title: "Ahorro",
    description:
      "Optimizamos procesos, reducimos costos y maximizamos el retorno de tu inversión.",
    icon: "PiggyBank",
  },
  {
    title: "Innovación",
    description:
      "Convertimos la innovación en impacto real para tu empresa y el país.",
    icon: "Lightbulb",
  },
  {
    title: "Experiencia",
    description:
      "Soluciones robustas guiadas por expertos que acompañan cada paso.",
    icon: "Award",
  },
  {
    title: "Escalabilidad",
    description:
      "Soluciones que evolucionan de forma ágil y segura junto a tu negocio.",
    icon: "Layers",
  },
] as const;

export const homeFaqs = [
  {
    q: "¿Qué hace exactamente HISTECH?",
    a: "Somos un aliado estratégico en tecnología. Implementamos soluciones de Inteligencia Artificial, Ciberseguridad, Cloud, Infraestructura de Redes y Transformación Digital para que las empresas operen de forma más eficiente, segura y escalable.",
  },
  {
    q: "¿Trabajan con empresas de cualquier tamaño?",
    a: "Sí. Diseñamos soluciones escalables y a la medida, desde pymes en crecimiento hasta organizaciones con operaciones complejas en múltiples sectores.",
  },
  {
    q: "¿Con qué tecnologías y fabricantes trabajan?",
    a: "Trabajamos con líderes del mercado como AWS, Microsoft Azure, Google Cloud, Cisco, Sophos, WatchGuard, VMware, Veeam y Dell Technologies, entre otros, para garantizar calidad y respaldo.",
  },
  {
    q: "¿Cómo inicio un proyecto con HISTECH?",
    a: "Agenda una consultoría sin costo. Te escuchamos, hacemos un diagnóstico de tus necesidades y te entregamos una propuesta clara, medible y alineada con tus objetivos.",
  },
  {
    q: "¿Ofrecen soporte y monitoreo continuo?",
    a: "Sí. Nuestros servicios gestionados incluyen monitoreo 24/7, soporte y administración de infraestructura con costos predecibles.",
  },
] as const;
