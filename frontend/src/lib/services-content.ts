/**
 * Contenido completo de cada landing de servicio.
 * Indexado por slug (sin "/"). Consumido por la ruta dinámica/estática y el sitemap.
 */

export type Capability = { title: string; description: string; icon: string };

export type ServiceContent = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  icon: string;
  /** Imagen alusiva (en /public/servicios/<slug>.png). Si falta, se usa el visual de ícono. */
  image?: string;
  visual: "orbit" | "shield" | "grid" | "stream";
  capabilities: Capability[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  related: string[]; // slugs
};

export const servicesContent: Record<string, ServiceContent> = {
  "inteligencia-artificial": {
    slug: "inteligencia-artificial",
    name: "Inteligencia Artificial Empresarial",
    eyebrow: "Inteligencia Artificial",
    title: "Inteligencia Artificial que trabaja por tu empresa",
    subtitle:
      "Automatización, agentes inteligentes y analítica avanzada para que tu organización decida más rápido y opere con menos fricción.",
    intro:
      "La inteligencia artificial dejó de ser una promesa futura: hoy es una ventaja competitiva. En HISTECH implementamos soluciones de IA aplicadas a tus procesos reales —no demos genéricas— para automatizar tareas, eliminar errores y convertir tus datos en decisiones.",
    icon: "BrainCircuit",
    image: "/servicios/inteligencia-artificial.png",
    visual: "stream",
    capabilities: [
      { title: "Agentes inteligentes", description: "Asistentes que ejecutan tareas, responden y operan dentro de tus sistemas.", icon: "Sparkles" },
      { title: "Automatización de procesos", description: "RPA + IA para flujos documentales, validaciones y procesos críticos.", icon: "Workflow" },
      { title: "Analítica avanzada", description: "Modelos predictivos y analítica para anticipar y decidir mejor.", icon: "Activity" },
      { title: "Asistentes y chatbots", description: "Atención y soporte conversacional integrado a tus canales.", icon: "BrainCircuit" },
    ],
    benefits: [
      "Reducción drástica de errores operativos",
      "Decisiones basadas en datos en tiempo real",
      "Mayor productividad sin aumentar personal",
      "Procesos disponibles 24/7",
      "Escalabilidad inmediata",
      "ROI medible y sostenible",
    ],
    faqs: [
      { q: "¿La IA reemplaza a mi equipo?", a: "No. La IA automatiza tareas repetitivas para que tu equipo se enfoque en lo estratégico. Aumenta capacidad, no reemplaza talento." },
      { q: "¿Necesito muchos datos para empezar?", a: "No necesariamente. Diseñamos soluciones por fases; comenzamos con casos de uso concretos y escalamos con resultados." },
      { q: "¿Es seguro para mi información?", a: "Sí. Implementamos IA con controles de seguridad, privacidad de datos y cumplimiento normativo desde el diseño." },
    ],
    related: ["ecosistemas-digitales", "transformacion-digital", "ciberseguridad"],
  },

  "transformacion-digital": {
    slug: "transformacion-digital",
    name: "Transformación Digital",
    eyebrow: "Transformación Digital",
    title: "Modernizamos tu empresa con estrategia y tecnología",
    subtitle:
      "Metodologías probadas para evolucionar tu operación con innovación, automatización y una hoja de ruta clara.",
    intro:
      "La transformación digital no se trata de comprar tecnología, sino de rediseñar cómo opera tu empresa. Te acompañamos con una estrategia clara, medible y alineada con tus objetivos de negocio.",
    icon: "Workflow",
    image: "/servicios/transformacion-digital.png",
    visual: "orbit",
    capabilities: [
      { title: "Diagnóstico de madurez digital", description: "Evaluamos dónde estás y trazamos el camino hacia dónde quieres llegar.", icon: "Activity" },
      { title: "Hoja de ruta estratégica", description: "Plan por fases, priorizado por impacto y retorno de inversión.", icon: "Layers" },
      { title: "Adopción y cambio", description: "Capacitación y acompañamiento para que la tecnología se adopte de verdad.", icon: "GraduationCap" },
      { title: "Automatización de procesos", description: "Eliminamos tareas manuales y conectamos tu operación.", icon: "Workflow" },
    ],
    benefits: [
      "Procesos más ágiles y eficientes",
      "Reducción de costos operativos",
      "Mejor experiencia para clientes y empleados",
      "Cultura orientada a la innovación",
      "Decisiones basadas en datos",
      "Ventaja competitiva sostenible",
    ],
    faqs: [
      { q: "¿Cuánto tarda una transformación digital?", a: "Depende del alcance, pero trabajamos por fases con entregables tempranos para que veas valor desde las primeras semanas." },
      { q: "¿Por dónde debo empezar?", a: "Por un diagnóstico. Identificamos las oportunidades de mayor impacto y construimos una hoja de ruta priorizada." },
    ],
    related: ["inteligencia-artificial", "ecosistemas-digitales", "consultoria-it"],
  },

  "ecosistemas-digitales": {
    slug: "ecosistemas-digitales",
    name: "Ecosistemas Digitales",
    eyebrow: "Ecosistemas Digitales",
    title: "Conectamos personas, procesos, datos y tecnología",
    subtitle:
      "Diseñamos ecosistemas donde toda tu organización trabaja en sincronía, con información en tiempo real y automatización inteligente.",
    intro:
      "Una empresa eficiente no tiene islas de información. Construimos ecosistemas digitales que integran tus sistemas, automatizan tus procesos y unifican tus datos para que todo fluya.",
    icon: "Network",
    image: "/servicios/ecosistemas-digitales.png",
    visual: "orbit",
    capabilities: [
      { title: "Integración de sistemas", description: "Conectamos tus aplicaciones y plataformas mediante APIs.", icon: "Network" },
      { title: "Automatización con IA y RPA", description: "Orquestamos procesos de extremo a extremo.", icon: "Workflow" },
      { title: "Datos unificados", description: "Una única fuente de verdad para toda la organización.", icon: "Layers" },
      { title: "Experiencias conectadas", description: "Canales de venta, atención y operación integrados.", icon: "Sparkles" },
    ],
    benefits: [
      "Procesos conectados de extremo a extremo",
      "Información en tiempo real",
      "Menos errores y reprocesos",
      "Mayor velocidad operativa",
      "Escalabilidad sin fricción",
      "Mejor experiencia de cliente",
    ],
    faqs: [
      { q: "¿Funciona con los sistemas que ya tengo?", a: "Sí. Nos especializamos en integrar tus herramientas actuales mediante APIs e integraciones a la medida." },
      { q: "¿Qué es RPA?", a: "Robotic Process Automation: software que automatiza tareas repetitivas imitando acciones humanas, combinado con IA para mayor inteligencia." },
    ],
    related: ["inteligencia-artificial", "transformacion-digital", "cloud-continuidad"],
  },

  ciberseguridad: {
    slug: "ciberseguridad",
    name: "Ciberseguridad",
    eyebrow: "Ciberseguridad",
    title: "Protegemos lo más valioso: tu información",
    subtitle:
      "Soluciones de seguridad precisas, basadas en el análisis profundo de tu entorno, tus riesgos y tus controles existentes.",
    intro:
      "En ciberseguridad, lo único constante es la evolución de las amenazas. Por eso no aplicamos plantillas: diseñamos una estrategia de seguridad a la medida de tu infraestructura para fortalecer tu operación y la confianza de tus clientes.",
    icon: "ShieldCheck",
    image: "/servicios/ciberseguridad.png",
    visual: "shield",
    capabilities: [
      { title: "Seguridad de perímetro", description: "Firewalls de próxima generación y protección de red.", icon: "Shield" },
      { title: "Endpoints y servidores", description: "Protección avanzada de estaciones de trabajo y servidores.", icon: "Server" },
      { title: "Control de acceso", description: "Gestión de identidades y accesos con mínimo privilegio.", icon: "Eye" },
      { title: "Monitoreo de amenazas", description: "Detección y respuesta continua ante incidentes.", icon: "Activity" },
      { title: "Cumplimiento normativo", description: "Alineación con estándares y regulaciones de tu sector.", icon: "ShieldCheck" },
      { title: "Evaluación y diagnóstico", description: "Análisis de vulnerabilidades y postura de seguridad.", icon: "Target" },
    ],
    benefits: [
      "Reducción de vulnerabilidades",
      "Continuidad operativa protegida",
      "Confianza de clientes y aliados",
      "Cumplimiento normativo",
      "Respuesta rápida ante incidentes",
      "Protección de datos críticos",
    ],
    faqs: [
      { q: "¿Mi empresa es muy pequeña para ser un objetivo?", a: "Ninguna empresa es demasiado pequeña. De hecho, las pymes suelen ser blanco por tener menos defensas. La seguridad es para todos." },
      { q: "¿Por dónde empezamos?", a: "Por una evaluación de tu postura de seguridad actual. A partir del diagnóstico priorizamos los controles de mayor impacto." },
      { q: "¿Ofrecen monitoreo continuo?", a: "Sí. Contamos con monitoreo y respuesta ante amenazas para detectar y contener incidentes a tiempo." },
    ],
    related: ["cloud-continuidad", "infraestructura-de-redes", "managed-services"],
  },

  "cloud-continuidad": {
    slug: "cloud-continuidad",
    name: "Cloud y Continuidad",
    eyebrow: "Cloud y Continuidad del Negocio",
    title: "Tu negocio, siempre disponible",
    subtitle:
      "Nube híbrida, respaldo y recuperación ante desastres para que tu operación nunca se detenga.",
    intro:
      "La continuidad de tu negocio depende de una infraestructura resiliente. Diseñamos arquitecturas cloud seguras y confiables, con respaldo y recuperación, para que accedas a tus datos desde cualquier lugar, en cualquier momento.",
    icon: "Cloud",
    image: "/servicios/cloud-continuidad.png",
    visual: "orbit",
    capabilities: [
      { title: "Nube híbrida y multi-cloud", description: "Arquitecturas en AWS, Azure, Google Cloud y más.", icon: "Cloud" },
      { title: "Respaldo automatizado", description: "Backups confiables con Veeam, Acronis y Zerto.", icon: "Server" },
      { title: "Recuperación ante desastres", description: "Planes de DR para restaurar la operación rápidamente.", icon: "Layers" },
      { title: "Alta disponibilidad", description: "Arquitecturas redundantes sin puntos únicos de falla.", icon: "Activity" },
    ],
    benefits: [
      "Acceso seguro desde cualquier lugar",
      "Reducción de costos de infraestructura",
      "Continuidad ante incidentes",
      "Escalabilidad bajo demanda",
      "Rendimiento y disponibilidad",
      "Respaldo y recuperación garantizados",
    ],
    faqs: [
      { q: "¿Qué proveedor de nube es mejor para mí?", a: "Depende de tu operación. Somos agnósticos: te recomendamos la nube (o mezcla) que mejor se ajuste a tus necesidades y presupuesto." },
      { q: "¿Qué pasa si falla un servidor?", a: "Con alta disponibilidad y planes de recuperación, tu operación continúa. Diseñamos arquitecturas sin puntos únicos de falla." },
    ],
    related: ["ciberseguridad", "infraestructura-de-redes", "computo"],
  },

  "infraestructura-de-redes": {
    slug: "infraestructura-de-redes",
    name: "Infraestructura de Redes",
    eyebrow: "Infraestructura de Redes",
    title: "La base sólida que sostiene tu operación",
    subtitle:
      "Conectividad confiable y robusta que comienza con un entendimiento profundo de tu entorno.",
    intro:
      "Deja la infraestructura de tu empresa en manos expertas. Diseñamos soluciones de red personalizadas —zero-touch, de alta calidad y con networking inteligente— para maximizar tu inversión y garantizar una experiencia de usuario óptima.",
    icon: "Server",
    image: "/servicios/infraestructura-de-redes.png",
    visual: "grid",
    capabilities: [
      { title: "Redes zero-touch", description: "Aprovisionamiento automatizado y despliegue ágil.", icon: "Network" },
      { title: "AI networking", description: "Redes inteligentes que se optimizan y anticipan fallas.", icon: "BrainCircuit" },
      { title: "Conectividad de alto rendimiento", description: "Diseños hub, estrella y malla según tu operación.", icon: "Server" },
      { title: "Seguridad por diseño", description: "Segmentación y protección integradas a la red.", icon: "Shield" },
    ],
    benefits: [
      "Operación continua y confiable",
      "Escalabilidad y crecimiento",
      "Seguridad y protección de datos",
      "Base para la innovación digital",
      "Ventaja competitiva",
      "Experiencia de usuario óptima",
    ],
    faqs: [
      { q: "¿Trabajan con mi infraestructura actual?", a: "Sí. Evaluamos tu entorno y diseñamos soluciones que aprovechan e integran lo que ya tienes." },
      { q: "¿Qué fabricantes utilizan?", a: "Trabajamos con líderes como Cisco, Extreme Networks, Sophos y WatchGuard, según el mejor ajuste para tu caso." },
    ],
    related: ["ciberseguridad", "cloud-continuidad", "computo"],
  },

  computo: {
    slug: "computo",
    name: "Cómputo",
    eyebrow: "Cómputo Corporativo",
    title: "La eficiencia comienza con el equipo adecuado",
    subtitle:
      "Soluciones de cómputo confiables y escalables, desde estaciones corporativas hasta servidores de centro de datos.",
    intro:
      "La productividad de tu equipo depende de las herramientas adecuadas. Ofrecemos una amplia gama de soluciones de cómputo corporativo y servidores, optimizadas para el rendimiento y la efectividad operativa en entornos híbridos y de alta demanda.",
    icon: "Cpu",
    image: "/servicios/computo.png",
    visual: "grid",
    capabilities: [
      { title: "Cómputo corporativo", description: "Equipos con procesadores de última generación y NVMe.", icon: "Cpu" },
      { title: "Servidores de centro de datos", description: "Infraestructura escalable para alta demanda.", icon: "Server" },
      { title: "Gestión inteligente", description: "Administración y mantenimiento remoto eficiente.", icon: "Settings2" },
      { title: "Optimización de rendimiento", description: "Refrigeración y configuración para operación constante.", icon: "Activity" },
    ],
    benefits: [
      "Productividad operativa",
      "Compatibilidad con software especializado",
      "Seguridad de la información",
      "Reducción de fallos y tiempos muertos",
      "Escalabilidad tecnológica",
      "Mejor experiencia del usuario",
    ],
    faqs: [
      { q: "¿Venden equipos o también los administran?", a: "Ambos. Proveemos el hardware adecuado y ofrecemos gestión, administración remota y mantenimiento como servicio." },
      { q: "¿Sirve para entornos híbridos?", a: "Sí. Nuestras soluciones están diseñadas para trabajo híbrido y de alta demanda, con administración remota incluida." },
    ],
    related: ["infraestructura-de-redes", "cloud-continuidad", "managed-services"],
  },

  "consultoria-it": {
    slug: "consultoria-it",
    name: "Consultoría en IT",
    eyebrow: "Consultoría & Asesoría",
    title: "Asesoría experta para cada decisión tecnológica",
    subtitle:
      "¿No sabes por dónde iniciar? Te asesoramos de forma directa, capacitamos a tu equipo y logramos que tu empresa adopte el cambio.",
    intro:
      "La tecnología solo genera valor cuando se adopta bien. Actuamos como tu CIO virtual: combinamos experiencia técnica y de negocio para diagnosticar, recomendar y acompañar cada paso de tu evolución tecnológica.",
    icon: "GraduationCap",
    image: "/servicios/consultoria-it.png",
    visual: "orbit",
    capabilities: [
      { title: "Diagnóstico tecnológico", description: "Identificamos brechas y oportunidades de mejora.", icon: "Target" },
      { title: "Estrategia y roadmap", description: "Plan tecnológico alineado a tus objetivos.", icon: "Layers" },
      { title: "Capacitación", description: "Formamos a tu equipo para una adopción real.", icon: "GraduationCap" },
      { title: "CIO virtual", description: "Acompañamiento estratégico continuo.", icon: "HeartHandshake" },
    ],
    benefits: [
      "Decisiones tecnológicas acertadas",
      "Reducción de riesgos e ineficiencias",
      "Adopción real de la tecnología",
      "Acompañamiento experto",
      "Optimización de inversión",
      "Visión estratégica de largo plazo",
    ],
    faqs: [
      { q: "¿Qué es un CIO virtual?", a: "Es contar con la dirección estratégica de tecnología de un experto, sin el costo de un cargo de tiempo completo. Te guiamos en cada decisión." },
      { q: "¿Atienden empresas sin área de TI?", a: "Sí. Es justo donde más aportamos: nos volvemos tu aliado tecnológico de confianza." },
    ],
    related: ["transformacion-digital", "inteligencia-artificial", "managed-services"],
  },

  "managed-services": {
    slug: "managed-services",
    name: "Servicios Gestionados",
    eyebrow: "Managed Services",
    title: "Un equipo de expertos cuidando tu tecnología",
    subtitle:
      "Monitoreo 24/7, soporte y administración de infraestructura con costos predecibles y tranquilidad total.",
    intro:
      "¿Por qué contratar a una sola persona de TI cuando puedes tener todo un equipo de expertos por una fracción del costo? Nos encargamos de tu tecnología para que tú te enfoques en hacer crecer tu negocio.",
    icon: "Settings2",
    image: "/servicios/managed-services.png",
    visual: "stream",
    capabilities: [
      { title: "Monitoreo 24/7", description: "Vigilancia continua de infraestructura, equipos y servidores.", icon: "Activity" },
      { title: "Soporte y Helpdesk", description: "Asistencia técnica permanente para tu equipo.", icon: "HeartHandshake" },
      { title: "Administración de infraestructura", description: "Gestión proactiva y mantenimiento preventivo.", icon: "Server" },
      { title: "Soporte en sitio", description: "Atención técnica presencial cuando se requiere.", icon: "Settings2" },
    ],
    benefits: [
      "Costos predecibles con tarifa fija",
      "Disponibilidad permanente",
      "Mayor productividad del equipo",
      "Prevención de problemas antes de que ocurran",
      "Protección de datos y operación",
      "Foco en tu negocio, no en apagar incendios",
    ],
    faqs: [
      { q: "¿Cómo se cobra el servicio gestionado?", a: "Con una tarifa mensual predecible que cubre la cobertura acordada. Sin sorpresas cuando algo falla." },
      { q: "¿Reemplaza a mi área de TI?", a: "Puede reemplazarla o complementarla. Nos adaptamos: desde cubrir toda la operación hasta apoyar a tu equipo interno." },
    ],
    related: ["ciberseguridad", "infraestructura-de-redes", "computo"],
  },

  "soluciones-web": {
    slug: "soluciones-web",
    name: "Soluciones Web",
    eyebrow: "Desarrollo Web",
    title: "Plataformas web de alto rendimiento",
    subtitle:
      "Sitios y aplicaciones web modernas, seguras y escalables que impulsan tu presencia digital y tus conversiones.",
    intro:
      "Tu plataforma web es la cara digital de tu empresa. Diseñamos y desarrollamos experiencias web rápidas, seguras y optimizadas para conversión, con las mejores prácticas de rendimiento, SEO y accesibilidad.",
    icon: "Workflow",
    image: "/servicios/soluciones-web.png",
    visual: "grid",
    capabilities: [
      { title: "Sitios corporativos", description: "Presencia digital premium, rápida y optimizada.", icon: "Sparkles" },
      { title: "Aplicaciones web", description: "Plataformas a la medida, seguras y escalables.", icon: "Workflow" },
      { title: "SEO técnico", description: "Arquitectura optimizada para buscadores.", icon: "Target" },
      { title: "Rendimiento y accesibilidad", description: "Core Web Vitals y estándares WCAG.", icon: "Activity" },
    ],
    benefits: [
      "Mayor velocidad y rendimiento",
      "Mejor posicionamiento en buscadores",
      "Experiencia de usuario premium",
      "Seguridad por diseño",
      "Escalabilidad",
      "Más conversiones",
    ],
    faqs: [
      { q: "¿Con qué tecnologías desarrollan?", a: "Usamos stacks modernos como Next.js y React, optimizados para rendimiento, SEO y escalabilidad." },
      { q: "¿Incluye mantenimiento?", a: "Sí. Ofrecemos planes de mantenimiento y evolución continua de tu plataforma." },
    ],
    related: ["transformacion-digital", "inteligencia-artificial", "ecosistemas-digitales"],
  },
};

export const serviceSlugs = Object.keys(servicesContent);
