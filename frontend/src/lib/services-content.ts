/**
 * Contenido completo de cada landing de servicio.
 * Indexado por slug (sin "/"). Consumido por la ruta dinámica/estática y el sitemap.
 */

export type Capability = { title: string; description: string; icon: string };

/** Caso de uso: ¿cuándo se utiliza este servicio? (bloque AEO). */
export type UseCase = { title: string; description: string; icon: string };

/** Paso del proceso de trabajo de HISTECH para este servicio (bloque AEO). */
export type ProcessStep = { step: string; title: string; description: string };

/** Captura del producto en uso. `phone` es vertical (celular); `wide` es de escritorio o documento. */
export type Screenshot = {
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  kind: "phone" | "wide";
};

export type ServiceContent = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Título SEO (sin marca; buildMetadata añade "| HISTECH"). Si falta, se usa `name`. */
  metaTitle?: string;
  /** Meta description (140-160 caracteres). Si falta, se usa `subtitle`. */
  metaDescription?: string;
  /** Marca distribuida en este servicio; se emite como `brand` en el JSON-LD de Service. */
  brand?: string;
  intro: string;
  icon: string;
  /** Imagen alusiva (en /public/servicios/<slug>.png). Si falta, se usa el visual de ícono. */
  image?: string;
  visual: "orbit" | "shield" | "grid" | "stream";
  capabilities: Capability[];
  /** Registro fotográfico del producto en uso. Si falta, no se muestra la sección. */
  screenshots?: Screenshot[];
  /** Casos de uso — cuándo se utiliza (AEO/GEO). */
  useCases: UseCase[];
  /** Proceso de trabajo de HISTECH para este servicio (AEO/GEO). */
  process: ProcessStep[];
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
    metaTitle: "Inteligencia Artificial para Empresas en Colombia",
    metaDescription:
      "Agentes inteligentes, automatización y analítica avanzada con IA para empresas en Colombia. HISTECH te ayuda a decidir más rápido y operar con menos fricción.",
    capabilities: [
      { title: "Agentes inteligentes", description: "Asistentes que ejecutan tareas, responden y operan dentro de tus sistemas.", icon: "Sparkles" },
      { title: "Automatización de procesos", description: "RPA + IA para flujos documentales, validaciones y procesos críticos.", icon: "Workflow" },
      { title: "Analítica avanzada", description: "Modelos predictivos y analítica para anticipar y decidir mejor.", icon: "Activity" },
      { title: "Asistentes y chatbots", description: "Atención y soporte conversacional integrado a tus canales.", icon: "BrainCircuit" },
    ],
    useCases: [
      { title: "Atención al cliente 24/7", description: "Asistentes que responden consultas frecuentes, califican prospectos y escalan a un humano cuando hace falta.", icon: "BrainCircuit" },
      { title: "Procesamiento de documentos", description: "Extracción y validación automática de facturas, contratos y formularios sin digitación manual.", icon: "Workflow" },
      { title: "Pronóstico y analítica", description: "Modelos que anticipan demanda, rotación o riesgo para decidir con anticipación.", icon: "Activity" },
    ],
    process: [
      { step: "01", title: "Identificamos el caso de uso", description: "Detectamos el proceso que pierde tiempo, genera errores o cuesta de más." },
      { step: "02", title: "Prueba de concepto", description: "Implementamos un piloto medible sobre tus datos reales en semanas, no meses." },
      { step: "03", title: "Integración y despliegue", description: "Conectamos la IA a tus sistemas con controles de seguridad y privacidad desde el diseño." },
      { step: "04", title: "Mejora continua", description: "Medimos resultados, ajustamos y escalamos la solución a nuevos procesos." },
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
    metaTitle: "Transformación Digital Empresarial en Colombia",
    metaDescription:
      "Estrategia, automatización e innovación para modernizar tu empresa. HISTECH acompaña tu transformación digital en Colombia con una hoja de ruta clara.",
    capabilities: [
      { title: "Diagnóstico de madurez digital", description: "Evaluamos dónde estás y trazamos el camino hacia dónde quieres llegar.", icon: "Activity" },
      { title: "Hoja de ruta estratégica", description: "Plan por fases, priorizado por impacto y retorno de inversión.", icon: "Layers" },
      { title: "Adopción y cambio", description: "Capacitación y acompañamiento para que la tecnología se adopte de verdad.", icon: "GraduationCap" },
      { title: "Automatización de procesos", description: "Eliminamos tareas manuales y conectamos tu operación.", icon: "Workflow" },
    ],
    useCases: [
      { title: "Empresas con procesos manuales", description: "Organizaciones que dependen de hojas de cálculo y tareas repetitivas que frenan su operación.", icon: "Workflow" },
      { title: "Operaciones desconectadas", description: "Áreas y sistemas que no comparten información y generan reprocesos.", icon: "Network" },
      { title: "Crecimiento sin escalabilidad", description: "Negocios que crecen pero cuya tecnología no acompaña el ritmo.", icon: "TrendingUp" },
    ],
    process: [
      { step: "01", title: "Diagnóstico de madurez digital", description: "Evaluamos dónde estás hoy y dónde quieres llegar." },
      { step: "02", title: "Hoja de ruta priorizada", description: "Plan por fases ordenado por impacto y retorno de inversión." },
      { step: "03", title: "Implementación por fases", description: "Ejecutamos con entregables tempranos para ver valor desde el inicio." },
      { step: "04", title: "Adopción y acompañamiento", description: "Capacitamos a tu equipo para que la tecnología se adopte de verdad." },
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
    metaTitle: "Ecosistemas Digitales e Integración de Sistemas",
    metaDescription:
      "Integramos sistemas, datos y procesos en un ecosistema digital único, con información en tiempo real y automatización para empresas en Colombia.",
    capabilities: [
      { title: "Integración de sistemas", description: "Conectamos tus aplicaciones y plataformas mediante APIs.", icon: "Network" },
      { title: "Automatización con IA y RPA", description: "Orquestamos procesos de extremo a extremo.", icon: "Workflow" },
      { title: "Datos unificados", description: "Una única fuente de verdad para toda la organización.", icon: "Layers" },
      { title: "Experiencias conectadas", description: "Canales de venta, atención y operación integrados.", icon: "Sparkles" },
    ],
    useCases: [
      { title: "Sistemas que no se hablan", description: "ERP, CRM y herramientas aisladas que obligan a recapturar datos y generan errores.", icon: "Network" },
      { title: "Datos dispersos", description: "Información duplicada o inconsistente entre áreas que impide decidir con confianza.", icon: "Layers" },
      { title: "Experiencia omnicanal", description: "Unificar venta, atención y operación en un solo flujo para el cliente.", icon: "Sparkles" },
    ],
    process: [
      { step: "01", title: "Mapeo de sistemas y procesos", description: "Entendemos cómo fluye hoy la información en tu organización." },
      { step: "02", title: "Diseño de la integración", description: "Definimos la arquitectura, las APIs y los puntos de automatización." },
      { step: "03", title: "Integración y automatización", description: "Conectamos tus aplicaciones con APIs y RPA de extremo a extremo." },
      { step: "04", title: "Monitoreo y optimización", description: "Medimos el flujo de datos y afinamos para mayor velocidad y menos errores." },
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
    metaTitle: "Ciberseguridad Empresarial en Colombia",
    metaDescription:
      "Protección de perímetro, endpoints y accesos, con monitoreo de amenazas y cumplimiento normativo para empresas en Colombia. Asesoría de HISTECH.",
    capabilities: [
      { title: "Seguridad de perímetro", description: "Firewalls de próxima generación y protección de red.", icon: "Shield" },
      { title: "Endpoints y servidores", description: "Protección avanzada de estaciones de trabajo y servidores.", icon: "Server" },
      { title: "Control de acceso", description: "Gestión de identidades y accesos con mínimo privilegio.", icon: "Eye" },
      { title: "Monitoreo de amenazas", description: "Detección y respuesta continua ante incidentes.", icon: "Activity" },
      { title: "Cumplimiento normativo", description: "Alineación con estándares y regulaciones de tu sector.", icon: "ShieldCheck" },
      { title: "Evaluación y diagnóstico", description: "Análisis de vulnerabilidades y postura de seguridad.", icon: "Target" },
    ],
    useCases: [
      { title: "Protección frente a ransomware", description: "Empresas que necesitan blindar endpoints, correo y respaldos ante secuestro de datos.", icon: "ShieldCheck" },
      { title: "Cumplimiento normativo", description: "Sectores regulados que deben demostrar controles de seguridad y trazabilidad.", icon: "Shield" },
      { title: "Trabajo híbrido seguro", description: "Accesos remotos protegidos con identidad y mínimo privilegio.", icon: "Eye" },
    ],
    process: [
      { step: "01", title: "Evaluación de tu postura", description: "Analizamos vulnerabilidades, riesgos y controles existentes." },
      { step: "02", title: "Estrategia priorizada", description: "Diseñamos los controles de mayor impacto según tu riesgo real." },
      { step: "03", title: "Implementación de controles", description: "Desplegamos protección de perímetro, endpoints, accesos y datos." },
      { step: "04", title: "Monitoreo y respuesta", description: "Detectamos y contenemos incidentes de forma continua." },
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
    metaTitle: "Cloud, Respaldo y Continuidad del Negocio",
    metaDescription:
      "Nube híbrida, respaldo y recuperación ante desastres para que tu operación no se detenga. HISTECH diseña tu estrategia de cloud y continuidad en Colombia.",
    capabilities: [
      { title: "Nube híbrida y multi-cloud", description: "Arquitecturas en AWS, Azure, Google Cloud y más.", icon: "Cloud" },
      { title: "Respaldo automatizado", description: "Backups confiables con Veeam, Acronis y Zerto.", icon: "Server" },
      { title: "Recuperación ante desastres", description: "Planes de DR para restaurar la operación rápidamente.", icon: "Layers" },
      { title: "Alta disponibilidad", description: "Arquitecturas redundantes sin puntos únicos de falla.", icon: "Activity" },
    ],
    useCases: [
      { title: "Migración a la nube", description: "Empresas que quieren dejar servidores locales costosos y ganar flexibilidad.", icon: "Cloud" },
      { title: "Respaldo y recuperación", description: "Negocios que no pueden permitirse perder datos críticos.", icon: "Server" },
      { title: "Operación sin interrupciones", description: "Organizaciones cuya operación no tolera tiempos de caída.", icon: "Activity" },
    ],
    process: [
      { step: "01", title: "Evaluación y objetivos", description: "Definimos tus objetivos de recuperación (RTO/RPO) y revisamos tu infraestructura." },
      { step: "02", title: "Diseño de la arquitectura", description: "Proponemos la nube (o mezcla) que mejor se ajusta a tu operación y presupuesto." },
      { step: "03", title: "Migración y respaldo", description: "Migramos cargas y configuramos respaldos automatizados y redundancia." },
      { step: "04", title: "Pruebas y monitoreo", description: "Validamos la recuperación y monitoreamos disponibilidad y rendimiento." },
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
    metaTitle: "Infraestructura de Redes Empresariales en Colombia",
    metaDescription:
      "Diseño e implementación de redes empresariales zero-touch, seguras y de alta disponibilidad en Bogotá y Colombia, con soporte y optimización continua.",
    capabilities: [
      { title: "Redes zero-touch", description: "Aprovisionamiento automatizado y despliegue ágil.", icon: "Network" },
      { title: "AI networking", description: "Redes inteligentes que se optimizan y anticipan fallas.", icon: "BrainCircuit" },
      { title: "Conectividad de alto rendimiento", description: "Diseños hub, estrella y malla según tu operación.", icon: "Server" },
      { title: "Seguridad por diseño", description: "Segmentación y protección integradas a la red.", icon: "Shield" },
    ],
    useCases: [
      { title: "Nuevas sedes u oficinas", description: "Despliegue de una red confiable y segura desde cero.", icon: "Network" },
      { title: "Redes saturadas o inestables", description: "Rediseño de la infraestructura para recuperar rendimiento y disponibilidad.", icon: "Server" },
      { title: "Conectividad multi-sede", description: "Empresas que necesitan unir varias ubicaciones de forma segura y estable.", icon: "Workflow" },
    ],
    process: [
      { step: "01", title: "Levantamiento del entorno", description: "Entendemos tu operación, tus equipos y tus necesidades de conectividad." },
      { step: "02", title: "Diseño de la topología", description: "Definimos la arquitectura (hub, estrella o malla) según tu caso." },
      { step: "03", title: "Implementación zero-touch", description: "Aprovisionamos y desplegamos la red de forma ágil y automatizada." },
      { step: "04", title: "Soporte y optimización", description: "Monitoreamos, ajustamos y anticipamos fallas con networking inteligente." },
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
    related: ["ciberseguridad", "teltonika-colombia", "computo"],
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
    metaTitle: "Servidores y Equipos de Cómputo Corporativo",
    metaDescription:
      "Estaciones de trabajo y servidores de centro de datos, confiables y escalables, para empresas en Colombia. HISTECH te asesora en la selección y el despliegue.",
    capabilities: [
      { title: "Cómputo corporativo", description: "Equipos con procesadores de última generación y NVMe.", icon: "Cpu" },
      { title: "Servidores de centro de datos", description: "Infraestructura escalable para alta demanda.", icon: "Server" },
      { title: "Gestión inteligente", description: "Administración y mantenimiento remoto eficiente.", icon: "Settings2" },
      { title: "Optimización de rendimiento", description: "Refrigeración y configuración para operación constante.", icon: "Activity" },
    ],
    useCases: [
      { title: "Renovación de parque tecnológico", description: "Equipos obsoletos que frenan la productividad y elevan los fallos.", icon: "Cpu" },
      { title: "Software especializado", description: "Estaciones para diseño, ingeniería o análisis de datos de alta exigencia.", icon: "Settings2" },
      { title: "Servidores de alta demanda", description: "Infraestructura escalable para cargas críticas y entornos híbridos.", icon: "Server" },
    ],
    process: [
      { step: "01", title: "Análisis de necesidades", description: "Identificamos las cargas de trabajo y el equipo adecuado para cada rol." },
      { step: "02", title: "Selección y configuración", description: "Elegimos y preparamos el hardware optimizado para tu operación." },
      { step: "03", title: "Despliegue y puesta a punto", description: "Instalamos, configuramos y dejamos todo listo para producir." },
      { step: "04", title: "Gestión y mantenimiento", description: "Administración remota y mantenimiento preventivo para evitar tiempos muertos." },
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
    metaTitle: "Consultoría en TI y CIO Virtual en Colombia",
    metaDescription:
      "Diagnóstico tecnológico, hoja de ruta y acompañamiento experto en cada paso. Consultoría en TI y CIO virtual para empresas en Bogotá y toda Colombia.",
    capabilities: [
      { title: "Diagnóstico tecnológico", description: "Identificamos brechas y oportunidades de mejora.", icon: "Target" },
      { title: "Estrategia y roadmap", description: "Plan tecnológico alineado a tus objetivos.", icon: "Layers" },
      { title: "Capacitación", description: "Formamos a tu equipo para una adopción real.", icon: "GraduationCap" },
      { title: "CIO virtual", description: "Acompañamiento estratégico continuo.", icon: "HeartHandshake" },
    ],
    useCases: [
      { title: "Empresas sin área de TI", description: "Necesitan dirección tecnológica experta sin el costo de un cargo de tiempo completo.", icon: "HeartHandshake" },
      { title: "Decisiones de inversión", description: "Antes de comprar, migrar o cambiar de proveedor tecnológico.", icon: "Target" },
      { title: "Proyectos estancados", description: "Iniciativas que no avanzan o no entregan los resultados esperados.", icon: "Activity" },
    ],
    process: [
      { step: "01", title: "Diagnóstico tecnológico", description: "Identificamos brechas, riesgos y oportunidades de mejora." },
      { step: "02", title: "Estrategia y roadmap", description: "Trazamos un plan tecnológico alineado a tus objetivos de negocio." },
      { step: "03", title: "Acompañamiento en la ejecución", description: "Te guiamos en cada decisión como tu CIO virtual." },
      { step: "04", title: "Capacitación y adopción", description: "Formamos a tu equipo para una adopción real y sostenible." },
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
    metaTitle: "Servicios Gestionados de TI en Colombia",
    metaDescription:
      "Monitoreo 24/7, soporte y administración de infraestructura con costos predecibles. Servicios gestionados de TI para empresas en Bogotá y Colombia.",
    capabilities: [
      { title: "Monitoreo 24/7", description: "Vigilancia continua de infraestructura, equipos y servidores.", icon: "Activity" },
      { title: "Soporte y Helpdesk", description: "Asistencia técnica permanente para tu equipo.", icon: "HeartHandshake" },
      { title: "Administración de infraestructura", description: "Gestión proactiva y mantenimiento preventivo.", icon: "Server" },
      { title: "Soporte en sitio", description: "Atención técnica presencial cuando se requiere.", icon: "Settings2" },
    ],
    useCases: [
      { title: "Equipo de TI sobrecargado", description: "Liberar a tu área interna de las tareas operativas para que se enfoque en lo estratégico.", icon: "HeartHandshake" },
      { title: "Sin personal de TI dedicado", description: "Cobertura completa de tu tecnología por una tarifa fija predecible.", icon: "Settings2" },
      { title: "Disponibilidad 24/7", description: "Operaciones que requieren monitoreo y respuesta permanentes.", icon: "Activity" },
    ],
    process: [
      { step: "01", title: "Diagnóstico y onboarding", description: "Conocemos tu infraestructura y documentamos tu entorno." },
      { step: "02", title: "Cobertura y acuerdos", description: "Definimos el alcance, los tiempos de respuesta y los niveles de servicio." },
      { step: "03", title: "Monitoreo 24/7 y soporte", description: "Vigilamos, prevenimos y resolvemos antes de que afecte tu operación." },
      { step: "04", title: "Mejora continua", description: "Reportería periódica y optimización proactiva de tu tecnología." },
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
    related: ["ciberseguridad", "infraestructura-de-redes", "outsourcing-ti"],
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
    metaTitle: "Desarrollo de Sitios y Aplicaciones Web en Colombia",
    metaDescription:
      "Sitios corporativos y aplicaciones web rápidas, seguras y optimizadas para SEO y conversión. HISTECH desarrolla tu plataforma digital en Colombia.",
    capabilities: [
      { title: "Sitios corporativos", description: "Presencia digital premium, rápida y optimizada.", icon: "Sparkles" },
      { title: "Aplicaciones web", description: "Plataformas a la medida, seguras y escalables.", icon: "Workflow" },
      { title: "SEO técnico", description: "Arquitectura optimizada para buscadores.", icon: "Target" },
      { title: "Rendimiento y accesibilidad", description: "Core Web Vitals y estándares WCAG.", icon: "Activity" },
    ],
    useCases: [
      { title: "Presencia digital obsoleta", description: "Sitios lentos o desactualizados que no transmiten confianza ni convierten.", icon: "Sparkles" },
      { title: "Aplicaciones a la medida", description: "Plataformas internas o de cara al cliente que tu negocio necesita.", icon: "Workflow" },
      { title: "Posicionamiento en buscadores", description: "Empresas que quieren ser encontradas por sus clientes en Google.", icon: "Target" },
    ],
    process: [
      { step: "01", title: "Descubrimiento y objetivos", description: "Entendemos tu negocio, tu público y las metas de la plataforma." },
      { step: "02", title: "Diseño UX/UI", description: "Diseñamos una experiencia premium alineada a tu marca." },
      { step: "03", title: "Desarrollo y optimización", description: "Construimos con stacks modernos optimizados para SEO y rendimiento." },
      { step: "04", title: "Lanzamiento y evolución", description: "Publicamos, medimos y mejoramos de forma continua." },
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

  "automatizacion-empresarial": {
    slug: "automatizacion-empresarial",
    name: "Automatización Empresarial",
    eyebrow: "Automatización",
    title: "Automatización empresarial que libera el tiempo de tu equipo",
    subtitle:
      "RPA e inteligencia artificial para ejecutar tus procesos repetitivos sin errores, sin intervención manual y con disponibilidad permanente.",
    intro:
      "Cada hora que tu equipo dedica a tareas repetitivas es una hora que no dedica a hacer crecer el negocio. Automatizamos tus procesos de alto volumen combinando RPA e inteligencia artificial para reducir errores, acelerar la operación y escalar sin aumentar personal.",
    icon: "Workflow",
    visual: "stream",
    metaTitle: "Automatización Empresarial: RPA e IA para tus procesos",
    metaDescription:
      "Automatiza procesos repetitivos con RPA e inteligencia artificial: menos errores, más velocidad y trazabilidad para tu empresa en Colombia. Pide tu asesoría.",
    capabilities: [
      { title: "RPA (automatización robótica)", description: "Bots que ejecutan tareas repetitivas en tus aplicaciones, tal como lo haría una persona.", icon: "Workflow" },
      { title: "Automatización inteligente", description: "IA que interpreta, decide y aprende para automatizar procesos que requieren criterio.", icon: "BrainCircuit" },
      { title: "Integración entre sistemas", description: "Conectamos tus plataformas con APIs para que la información fluya sin recaptura.", icon: "Network" },
      { title: "Flujos documentales", description: "Extracción y validación automática de facturas, contratos y formularios.", icon: "Layers" },
    ],
    useCases: [
      { title: "Finanzas y administración", description: "Conciliaciones, registro de facturas y generación de reportes sin digitación manual.", icon: "Calculator" },
      { title: "Atención y ventas", description: "Respuesta a consultas frecuentes y calificación automática de prospectos.", icon: "HeartHandshake" },
      { title: "Operaciones", description: "Actualización de inventarios, órdenes y seguimiento de pedidos entre sistemas.", icon: "Settings2" },
    ],
    process: [
      { step: "01", title: "Identificamos el proceso", description: "Detectamos las tareas de alto volumen con mayor retorno al automatizarse." },
      { step: "02", title: "Diseñamos el flujo", description: "Rediseñamos el proceso para eliminar pasos innecesarios antes de automatizar." },
      { step: "03", title: "Piloto medible", description: "Validamos con un piloto y una métrica clara de éxito en semanas." },
      { step: "04", title: "Escalado y soporte", description: "Ampliamos a más procesos con monitoreo y mejora continua." },
    ],
    benefits: [
      "Reducción drástica de errores operativos",
      "Ahorro de horas-persona en tareas repetitivas",
      "Procesos disponibles 24/7",
      "Escalabilidad sin aumentar personal",
      "Trazabilidad total para auditoría",
      "ROI medible desde el primer proceso",
    ],
    faqs: [
      { q: "¿Qué procesos conviene automatizar primero?", a: "Los de alto volumen, repetitivos y con reglas claras: facturación, conciliaciones, carga de datos entre sistemas o respuestas a consultas frecuentes. Ahí el retorno es más rápido." },
      { q: "¿La automatización funciona con los sistemas que ya tengo?", a: "Sí. La RPA opera sobre tus aplicaciones actuales y, cuando es posible, integramos vía API para mayor robustez. No necesitas cambiar tus sistemas para empezar." },
      { q: "¿Cuánto tarda en verse el retorno?", a: "Un proceso acotado puede automatizarse en semanas mediante un piloto, y el retorno se mide con las horas liberadas y los errores evitados desde el inicio." },
    ],
    related: ["inteligencia-artificial", "ecosistemas-digitales", "transformacion-digital"],
  },

  "desarrollo-software-colombia": {
    slug: "desarrollo-software-colombia",
    name: "Desarrollo de Software a la Medida",
    eyebrow: "Desarrollo de Software",
    title: "Desarrollo de software a la medida para tu empresa",
    subtitle:
      "Aplicaciones y plataformas hechas a medida, seguras y escalables, construidas en torno a tus procesos reales y no al revés.",
    intro:
      "Cuando el software de catálogo te obliga a adaptar tu operación, pierdes lo que te hace competitivo. Desarrollamos soluciones a la medida —aplicaciones web, plataformas internas e integraciones— diseñadas alrededor de tus procesos, con las mejores prácticas de seguridad, rendimiento y escalabilidad.",
    icon: "Layers",
    visual: "grid",
    metaTitle: "Desarrollo de Software a la Medida en Colombia",
    metaDescription:
      "Aplicaciones, plataformas e integraciones a la medida de tus procesos, con seguridad y escalabilidad. Desarrollo de software para empresas en Colombia.",
    capabilities: [
      { title: "Software a la medida", description: "Plataformas y sistemas internos diseñados para tus procesos específicos.", icon: "Layers" },
      { title: "Aplicaciones web", description: "Aplicaciones modernas, rápidas y seguras para clientes y equipos.", icon: "Workflow" },
      { title: "Integraciones y APIs", description: "Conectamos tu software con los sistemas que ya usas.", icon: "Network" },
      { title: "Mantenimiento y evolución", description: "Soporte y mejora continua para que la plataforma crezca contigo.", icon: "Settings2" },
    ],
    useCases: [
      { title: "Procesos sin software adecuado", description: "Operaciones que hoy dependen de hojas de cálculo o herramientas que no encajan.", icon: "Layers" },
      { title: "Portales y plataformas", description: "Portales de clientes, proveedores o equipos internos a la medida.", icon: "Workflow" },
      { title: "Integración de sistemas", description: "Unir aplicaciones aisladas en una sola experiencia coherente.", icon: "Network" },
    ],
    process: [
      { step: "01", title: "Descubrimiento", description: "Entendemos tu negocio, tus procesos y los objetivos de la solución." },
      { step: "02", title: "Diseño UX/UI", description: "Diseñamos una experiencia clara y alineada a tu marca." },
      { step: "03", title: "Desarrollo seguro", description: "Construimos con stacks modernos, pruebas y seguridad por diseño." },
      { step: "04", title: "Lanzamiento y evolución", description: "Desplegamos, medimos y mejoramos de forma continua." },
    ],
    benefits: [
      "Software que se adapta a tu operación, no al revés",
      "Mayor eficiencia y menos trabajo manual",
      "Seguridad por diseño",
      "Escalabilidad a medida que creces",
      "Integración con tus sistemas actuales",
      "Propiedad total de tu solución",
    ],
    faqs: [
      { q: "¿Cuándo conviene software a la medida en vez de uno de catálogo?", a: "Cuando tus procesos son un diferencial competitivo, cuando ninguna herramienta del mercado encaja, o cuando integrar varias soluciones resulta más costoso y frágil que una plataforma propia." },
      { q: "¿Con qué tecnologías desarrollan?", a: "Usamos stacks modernos y probados (como Next.js, React y Node.js), elegidos según el rendimiento, la seguridad y la escalabilidad que tu proyecto necesita." },
      { q: "¿Incluye mantenimiento después del lanzamiento?", a: "Sí. Ofrecemos planes de soporte y evolución continua para que tu plataforma se mantenga segura y siga creciendo con tu negocio." },
    ],
    related: ["soluciones-web", "inteligencia-artificial", "ecosistemas-digitales"],
  },
  "teltonika-colombia": {
    slug: "teltonika-colombia",
    name: "Teltonika en Colombia",
    eyebrow: "Distribuidor de Teltonika",
    brand: "Teltonika",
    title: "Routers 4G y conectividad industrial Teltonika en Colombia",
    subtitle:
      "Venta, configuración e instalación de routers y gateways Teltonika 4G/LTE para conectar sedes, puntos de venta, cámaras y equipos IoT con gestión remota.",
    intro:
      "HISTECH es distribuidor de Teltonika en Colombia. Te asesoramos en la selección, te vendemos los equipos y los entregamos configurados, instalados y con soporte, para que tu operación mantenga una conexión estable incluso donde no llega el internet fijo.",
    icon: "Network",
    image: "/servicios/infraestructura-de-redes.png",
    visual: "grid",
    metaTitle: "Distribuidor Teltonika Colombia: Routers 4G Industriales",
    metaDescription:
      "Venta de equipos Teltonika en Colombia: routers 4G/LTE industriales, gateways y gestión remota RMS, con asesoría, instalación y soporte de HISTECH en Bogotá.",
    capabilities: [
      { title: "Routers industriales 4G/LTE y 5G", description: "Equipos de las series RUT para conectividad celular empresarial en sedes, vehículos y sitios remotos.", icon: "Network" },
      { title: "Gateways e IoT", description: "Pasarelas para conectar sensores, controladores y equipos industriales con tus plataformas.", icon: "Cpu" },
      { title: "Respaldo con doble SIM y failover", description: "Cambio automático entre operadores o hacia el enlace fijo, según el equipo, para no perder la conexión.", icon: "Activity" },
      { title: "Gestión remota con Teltonika RMS", description: "Monitoreo, configuración y actualización centralizada de tus equipos desde una sola plataforma.", icon: "Server" },
      { title: "Asesoría, configuración, instalación y soporte", description: "HISTECH selecciona el equipo, lo configura, lo instala en sitio y te acompaña después.", icon: "Settings2" },
    ],
    useCases: [
      { title: "Sucursales y oficinas remotas", description: "Internet celular como enlace principal o de respaldo cuando el servicio fijo no está disponible o falla.", icon: "Building2" },
      { title: "Puntos de venta", description: "Conectividad continua para transacciones, con respaldo automático si cae el enlace principal.", icon: "ShoppingBag" },
      { title: "Cámaras de seguridad (CCTV)", description: "Transmisión de video desde sitios sin red cableada, con gestión remota de los equipos.", icon: "Eye" },
      { title: "Flotas, telemetría e IoT", description: "Conexión de vehículos, maquinaria y sensores que operan en movimiento o a la intemperie.", icon: "Truck" },
    ],
    process: [
      { step: "01", title: "Levantamiento", description: "Revisamos tu sitio, la cobertura celular, la cantidad de equipos y el uso que tendrá la conexión." },
      { step: "02", title: "Selección del equipo", description: "Recomendamos la serie y el modelo de Teltonika que mejor se ajustan a tu caso." },
      { step: "03", title: "Configuración e instalación", description: "Entregamos el equipo configurado, con doble SIM o failover si aplica, e instalado en sitio." },
      { step: "04", title: "Gestión y soporte", description: "Conectamos tus equipos a la gestión remota cuando se requiere y brindamos soporte técnico posterior." },
    ],
    benefits: [
      "Conectividad donde no llega el internet fijo",
      "Respaldo ante fallas del enlace principal",
      "Gestión remota y centralizada de los equipos",
      "Despliegue ordenado en varias sedes",
      "Un solo proveedor para venta, instalación y soporte",
      "Equipos pensados para entornos industriales",
    ],
    faqs: [
      { q: "¿HISTECH es distribuidor de Teltonika en Colombia?", a: "Sí. HISTECH es distribuidor de Teltonika en Colombia: vende equipos Teltonika y acompaña a las empresas con asesoría, configuración, instalación y soporte técnico." },
      { q: "¿Qué es un router 4G industrial?", a: "Un router 4G industrial es un equipo que da acceso a internet por la red celular (SIM) y está diseñado para operar de forma continua en entornos exigentes, como sedes remotas, vehículos o plantas. A diferencia de un router doméstico, ofrece respaldo, gestión remota y funciones de seguridad empresarial." },
      { q: "¿Para qué sirve un router LTE empresarial?", a: "Sirve para conectar sedes, puntos de venta, cámaras o equipos IoT a internet por la red celular, ya sea como enlace principal donde no hay fibra o como respaldo automático cuando falla el enlace fijo." },
      { q: "¿Qué es Teltonika RMS?", a: "Teltonika RMS (Remote Management System) es la plataforma de gestión remota de Teltonika. Permite monitorear, configurar y actualizar los equipos de forma centralizada, sin desplazarse a cada sede." },
      { q: "¿Cuánto cuesta un router Teltonika en Colombia?", a: "El precio depende de la serie, el modelo y la cantidad de equipos, por lo que se cotiza según cada proyecto. Cuéntanos tu caso de uso y te enviamos una propuesta." },
      { q: "¿Pueden instalar equipos Teltonika en varias sedes?", a: "Sí. HISTECH puede planear y desplegar equipos en varias sedes con una configuración estandarizada y gestión centralizada, y prestar soporte remoto y, según la ubicación, en sitio." },
    ],
    related: ["infraestructura-de-redes", "managed-services", "ciberseguridad"],
  },

  "outsourcing-ti": {
    slug: "outsourcing-ti",
    name: "Outsourcing de TI y Mesa de Ayuda",
    eyebrow: "Outsourcing de TI",
    title: "Soporte técnico por tickets y outsourcing de TI para tu empresa",
    subtitle:
      "Mesa de ayuda, soporte remoto y en sitio, y administración de infraestructura, con un portal donde creas y sigues cada ticket.",
    intro:
      "Con el outsourcing de TI de HISTECH tu empresa cuenta con un equipo técnico y una mesa de ayuda sin asumir la contratación y gestión de personal propio. Cada solicitud se registra como un ticket en nuestro portal de soporte, para que sepas qué se pidió, quién lo atiende y cómo avanza.",
    icon: "HeartHandshake",
    image: "/servicios/managed-services.png",
    visual: "stream",
    metaTitle: "Outsourcing de TI y Mesa de Ayuda en Colombia",
    metaDescription:
      "Outsourcing de TI en Colombia: mesa de ayuda y soporte técnico remoto y en sitio por tickets, con portal de seguimiento y costos predecibles. Habla con HISTECH.",
    capabilities: [
      { title: "Mesa de ayuda (help desk)", description: "Punto único de contacto para que tus usuarios reporten incidentes y soliciten servicios.", icon: "HeartHandshake" },
      { title: "Soporte remoto y en sitio", description: "Atención a distancia y visitas técnicas cuando el caso lo requiere.", icon: "Settings2" },
      { title: "Portal de soporte con tickets", description: "Creación y seguimiento de solicitudes en línea, con historial de cada caso.", icon: "Workflow" },
      { title: "Seguimiento por empresa", description: "Estado, historial y reportes de los tickets de tu organización.", icon: "Activity" },
      { title: "Administración de infraestructura", description: "Gestión de equipos, usuarios, redes y servidores de tu empresa.", icon: "Server" },
    ],
    useCases: [
      { title: "Empresa sin área de TI", description: "Cubre el soporte tecnológico completo sin contratar personal de planta.", icon: "Briefcase" },
      { title: "Área de TI pequeña o sobrecargada", description: "El primer nivel de atención y las tareas repetitivas pasan a la mesa de ayuda.", icon: "Settings2" },
      { title: "Varias sedes o usuarios remotos", description: "Soporte centralizado por tickets para equipos ubicados en distintos lugares.", icon: "Network" },
      { title: "Necesidad de trazabilidad", description: "Cada solicitud queda registrada, con responsable e historial, para control y auditoría.", icon: "Eye" },
    ],
    process: [
      { step: "01", title: "Diagnóstico y alcance", description: "Conocemos tu entorno y tus usuarios, y definimos qué cubre el servicio." },
      { step: "02", title: "Acuerdo de servicio", description: "Se acuerdan por contrato los canales de atención, los horarios y los tiempos de respuesta." },
      { step: "03", title: "Operación por tickets", description: "Tu equipo crea los tickets en el portal y nuestros técnicos los atienden de forma remota o en sitio." },
      { step: "04", title: "Seguimiento y mejora", description: "Revisamos el historial y los reportes para resolver causas recurrentes y mejorar el servicio." },
    ],
    benefits: [
      "Costos predecibles",
      "Equipo técnico sin la carga de contratar y gestionar personal",
      "Trazabilidad de cada solicitud",
      "Visibilidad del estado de tus tickets en cualquier momento",
      "Tu área de TI se enfoca en lo estratégico",
      "Soporte remoto y en sitio con un solo proveedor",
    ],
    faqs: [
      { q: "¿Qué es el outsourcing de TI?", a: "El outsourcing de TI consiste en contratar a un proveedor externo para que se encargue del soporte técnico y de la administración de la tecnología de la empresa. Con HISTECH incluye mesa de ayuda, soporte remoto y en sitio y administración de infraestructura, con costos predecibles." },
      { q: "¿Cómo funciona el soporte técnico por tickets?", a: "Cada solicitud se registra como un ticket en el portal de soporte de HISTECH, donde la empresa lo crea y consulta su estado. Un técnico lo atiende y todo queda con historial para seguimiento y reportes." },
      { q: "¿Cómo accedo al portal de soporte de HISTECH?", a: "Los clientes ingresan con su usuario en histech.com.co/portal/login. Allí crean tickets y consultan el seguimiento de los casos de su empresa." },
      { q: "¿Cuáles son los tiempos de respuesta del servicio?", a: "Los tiempos de respuesta y los horarios de atención se acuerdan por contrato según las necesidades de cada empresa y se definen antes de iniciar el servicio." },
      { q: "¿Qué diferencia hay entre outsourcing de TI y servicios gestionados?", a: "Los servicios gestionados se enfocan en el monitoreo 24/7 y la administración proactiva de la infraestructura, mientras que el outsourcing de TI aporta personal técnico y una mesa de ayuda que atiende a los usuarios mediante tickets. Se pueden contratar por separado o combinados." },
      { q: "¿El servicio incluye soporte en sitio?", a: "Sí. Cuando el caso lo requiere, HISTECH envía un técnico a tu sede; el alcance y la cobertura geográfica se definen en el contrato. Muchos casos se resuelven de forma remota." },
    ],
    related: ["managed-services", "infraestructura-de-redes", "consultoria-it"],
  },

  "seguridad-vial-pesv": {
    slug: "seguridad-vial-pesv",
    name: "Seguridad Vial y PESV",
    eyebrow: "Seguridad Vial · PESV",
    title: "Tecnología para cumplir el Plan Estratégico de Seguridad Vial (PESV)",
    subtitle:
      "Inspecciones preoperacionales digitales, evidencia trazable y reportes para auditoría, para que tu empresa gestione el cumplimiento de la normativa de seguridad vial.",
    intro:
      "El Plan Estratégico de Seguridad Vial (PESV) es obligatorio en Colombia para las entidades públicas y privadas con una flota de más de diez vehículos o que contratan o administran conductores. Una de sus exigencias más operativas es la inspección preoperacional diaria, y no basta con diligenciar un formato: hay que demostrar gestión, control y evidencia. HISTECH Control Vial es nuestro software web y móvil para ese proceso: el conductor inspecciona el vehículo desde el celular, el supervisor aprueba o rechaza con su firma y la empresa conserva un PDF auditable, el histórico y los indicadores. Es una herramienta de apoyo: no sustituye la gestión del PESV ni la asesoría especializada.",
    icon: "Truck",
    image: "/servicios/control-vial/tablero-indicadores.webp",
    visual: "shield",
    screenshots: [
      { title: "1. El conductor inicia la inspección", description: "Cada ítem de la lista de chequeo se marca como correcto o con falla, daño o faltante.", image: "/servicios/control-vial/inspeccion-luces.webp", width: 452, height: 786, kind: "phone" },
      { title: "2. Revisión visual guiada", description: "La barra de progreso muestra cuántos ítems se han revisado y cuántos faltan.", image: "/servicios/control-vial/inspeccion-latoneria.webp", width: 382, height: 793, kind: "phone" },
      { title: "3. Documentos del conductor", description: "SOAT, licencia de conducción, tarjeta de propiedad y demás documentos, con opción de reportar un problema.", image: "/servicios/control-vial/checklist-documentos.webp", width: 440, height: 801, kind: "phone" },
      { title: "4. Inspecciones pendientes", description: "El supervisor recibe las inspecciones por revisar, con placa, conductor y hora.", image: "/servicios/control-vial/inspecciones-pendientes.webp", width: 402, height: 767, kind: "phone" },
      { title: "5. Decisión del supervisor", description: "El supervisor aprueba o rechaza la inspección; para rechazar, la observación es obligatoria.", image: "/servicios/control-vial/decision-supervisor.webp", width: 386, height: 795, kind: "phone" },
      { title: "Formato PDF de la inspección", description: "Lista de chequeo, estado, declaración de operación y firmas del conductor y del supervisor.", image: "/servicios/control-vial/pdf-inspeccion.webp", width: 826, height: 853, kind: "wide" },
      { title: "Tablero de indicadores", description: "Inspecciones realizadas, tasa de aprobación, rechazadas y con novedades, con exportación a Excel.", image: "/servicios/control-vial/tablero-indicadores.webp", width: 1211, height: 802, kind: "wide" },
      { title: "Detalle e histórico", description: "Vehículos con más novedades, elementos con más fallas y el detalle de cada inspección con su PDF.", image: "/servicios/control-vial/detalle-inspecciones.webp", width: 1138, height: 831, kind: "wide" },
    ],
    metaTitle: "Software PESV: Inspección Preoperacional Digital",
    metaDescription:
      "Software PESV para Colombia: inspecciones preoperacionales digitales con evidencia, trazabilidad y reportes para auditoría. Apoya tu cumplimiento con HISTECH.",
    capabilities: [
      { title: "Inspección preoperacional digital", description: "Lista de chequeo por tipo de vehículo (moto o carro) diligenciada desde el celular: ítems visuales, fluidos, documentación y elementos de seguridad.", icon: "ShieldCheck" },
      { title: "Evidencia en un solo expediente", description: "Fotografías, fecha, hora, placa, kilometraje, novedades, observaciones y firma de cada inspección.", icon: "Eye" },
      { title: "Declaración de operación", description: "El conductor describe las fallas, adjunta fotos, declara si el vehículo puede operar y firma en pantalla.", icon: "Truck" },
      { title: "Aprobación del supervisor", description: "El supervisor revisa el detalle y las novedades, aprueba o rechaza la inspección y firma su decisión.", icon: "Workflow" },
      { title: "Alertas por hallazgos", description: "Las fallas detectadas quedan marcadas para revisión del supervisor, con alertas de documentos por vencer según la configuración del proyecto.", icon: "Activity" },
      { title: "Registro de conductores y vehículos", description: "Documentos, vencimientos e historial de cada vehículo y conductor en un solo lugar.", icon: "Layers" },
      { title: "PDF auditable e histórico", description: "Documento PDF con lista de chequeo, fotografías, novedades y firmas, y búsqueda por fecha, conductor, placa, estado o supervisor.", icon: "Target" },
      { title: "Indicadores para SST y dirección", description: "Tablero de inspecciones realizadas, pendientes, aprobadas y rechazadas, fallas frecuentes y vehículos críticos, con exportación a Excel.", icon: "TrendingUp" },
      { title: "Roles y permisos", description: "Perfiles para conductor, supervisor, SST, dirección y administrador, cada uno con sus funciones y accesos.", icon: "Settings2" },
    ],
    useCases: [
      { title: "Empresas con flota propia", description: "Control diario del estado de motos y carros de la operación.", icon: "Truck" },
      { title: "Empresas con conductores a cargo", description: "Organizaciones que contratan o administran conductores y deben registrar sus inspecciones.", icon: "HeartHandshake" },
      { title: "Vigilancia y seguridad privada", description: "Supervisores motorizados, guardas, escoltas y rondas móviles, con vehículos propios o de los trabajadores usados en el servicio.", icon: "Shield" },
      { title: "Preparación de auditorías", description: "Evidencia ordenada y consultable para auditorías internas y verificaciones de las autoridades.", icon: "Eye" },
      { title: "Comités y revisiones de SST", description: "Indicadores y consulta histórica para articular el riesgo vial con el Sistema de Gestión de Seguridad y Salud en el Trabajo.", icon: "Activity" },
      { title: "Reemplazo del formato en papel", description: "Digitalizar formatos en papel, fotos enviadas por chat y firmas sin trazabilidad que hoy se consolidan a mano.", icon: "Layers" },
    ],
    process: [
      { step: "01", title: "Diagnóstico", description: "Revisamos el proceso actual, el formato de inspección, los roles, las sedes y el flujo de aprobación." },
      { step: "02", title: "Parametrización", description: "Configuramos usuarios, vehículos, placas, lista de chequeo, permisos, logo y formato del PDF." },
      { step: "03", title: "Puesta en marcha", description: "Capacitamos a conductores, supervisores, SST, dirección y administración, y comenzamos a registrar inspecciones." },
      { step: "04", title: "Soporte mensual", description: "Acompañamiento, ajustes menores, soporte técnico y mejora continua de la solución." },
    ],
    benefits: [
      "Evidencia fechada y trazable de cada inspección",
      "Menos papel y registros fáciles de consultar",
      "Decisión del supervisor registrada y firmada",
      "Visibilidad del cumplimiento por vehículo y conductor",
      "Detección oportuna de fallas y documentos por vencer",
      "Indicadores para SST y dirección",
      "Mejor respuesta ante auditorías",
      "Solución a la medida de tu flota",
    ],
    faqs: [
      { q: "¿Qué es el PESV?", a: "El PESV (Plan Estratégico de Seguridad Vial) es el plan que las organizaciones obligadas deben diseñar e implementar en Colombia para gestionar la seguridad vial de su operación. Se rige por la Ley 1503 de 2011 y por la metodología de la Resolución 40595 de 2022 del Ministerio de Transporte, que define 24 pasos." },
      { q: "¿Quién está obligado a tener un PESV?", a: "Está obligada toda entidad, organización o empresa, pública o privada, que tenga una flota de más de diez vehículos o que contrate o administre personal de conductores. Cuentan también los vehículos de los trabajadores que se usan para la actividad de la empresa. Conviene confirmar tu caso con un asesor en PESV." },
      { q: "¿Qué es la inspección preoperacional y por qué importa para el PESV?", a: "La inspección preoperacional es la revisión diaria del vehículo, con una lista de chequeo, antes de operarlo. El Paso 16 de la metodología del PESV (Resolución 40595 de 2022) exige un mecanismo de registro de esa inspección, con responsables de ejecutarla y de controlarla, y la conservación del registro del último año." },
      { q: "¿Qué es una inspección preoperacional digital?", a: "Es la lista de chequeo del vehículo diligenciada desde el celular u otro dispositivo en lugar de papel, con fecha, hora, responsable, fotos y firma. Facilita guardar la evidencia, consultarla y generar reportes para auditoría." },
      { q: "¿El software de HISTECH garantiza el cumplimiento del PESV?", a: "No. El PESV tiene 24 pasos y la mayoría son de gestión organizacional, como el liderazgo, las políticas y la capacitación. Nuestra solución apoya la parte operativa de la inspección preoperacional con evidencia y reportes, y no sustituye la gestión del PESV ni la asesoría especializada." },
      { q: "¿Qué registros puede generar la solución para una auditoría?", a: "Genera el registro de cada inspección con su lista de chequeo, responsable, fecha, hora, fotos y firmas, además de indicadores de cumplimiento y exportación de datos. Así tienes evidencia ordenada para auditorías internas o verificaciones." },
      { q: "¿Cómo hace el conductor la inspección desde el celular?", a: "El conductor selecciona su vehículo y registra el kilometraje, evalúa cada ítem de la lista de chequeo (luces, frenos, llantas, espejos, documentación y elementos de seguridad), adjunta fotos de las novedades, declara si el vehículo puede operar y firma en pantalla. La inspección queda asociada al conductor, la placa, la fecha y la hora." },
      { q: "¿Qué pasa cuando una inspección reporta una novedad?", a: "La inspección llega al supervisor, que revisa el detalle y las fotos, la aprueba o la rechaza y firma su decisión. Así la decisión no queda verbal ni dispersa: se registra en el sistema y se puede consultar después." },
      { q: "¿Sirve para empresas de vigilancia y seguridad privada?", a: "Sí. Aplica para supervisores motorizados, guardas, escoltas y rondas móviles, tanto con vehículos propios de la empresa como con vehículos de los trabajadores usados en la prestación del servicio." },
      { q: "¿Cómo se relaciona con el SG-SST?", a: "El riesgo vial debe articularse con el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST). La solución entrega al área de SST indicadores de cumplimiento, fallas frecuentes y vehículos críticos, además de exportación a Excel y consulta histórica para comités y auditorías." },
      { q: "¿Qué incluye la implementación de HISTECH Control Vial?", a: "Incluye un diagnóstico del proceso actual, la parametrización de usuarios, vehículos, lista de chequeo, permisos y formato del PDF, la capacitación a conductores, supervisores, SST, dirección y administración, y un soporte mensual con ajustes menores y mejora continua." },
    ],
    related: ["desarrollo-software-colombia", "automatizacion-empresarial", "ecosistemas-digitales"],
  },
};

export const serviceSlugs = Object.keys(servicesContent);
