/**
 * Contenido completo de cada landing de servicio.
 * Indexado por slug (sin "/"). Consumido por la ruta dinámica/estática y el sitemap.
 */

export type Capability = { title: string; description: string; icon: string };

/** Caso de uso: ¿cuándo se utiliza este servicio? (bloque AEO). */
export type UseCase = { title: string; description: string; icon: string };

/** Paso del proceso de trabajo de HISTECH para este servicio (bloque AEO). */
export type ProcessStep = { step: string; title: string; description: string };

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
};

export const serviceSlugs = Object.keys(servicesContent);
