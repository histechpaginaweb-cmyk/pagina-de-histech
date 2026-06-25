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
  /** Preguntas frecuentes del sector (AEO + FAQ JSON-LD). */
  faqs: { q: string; a: string }[];
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
    faqs: [
      { q: "¿Cómo ayuda la tecnología a una empresa de manufactura?", a: "Permite conectar planta, procesos y datos para monitorear la operación en tiempo real, automatizar tareas, anticipar fallas y proteger la infraestructura industrial (OT), mejorando la eficiencia y reduciendo tiempos muertos." },
      { q: "¿Qué es la industria 4.0?", a: "Es la integración de tecnologías como IoT, automatización, analítica de datos e inteligencia artificial en la operación industrial para tomar decisiones basadas en datos y producir de forma más eficiente y flexible." },
      { q: "¿Se puede digitalizar sin reemplazar la maquinaria actual?", a: "Sí. Evaluamos tu entorno y, en muchos casos, conectamos y aprovechamos los equipos existentes mediante sensores e integraciones, sin necesidad de reemplazar toda la planta." },
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
    faqs: [
      { q: "¿Cómo se protegen los datos clínicos sensibles?", a: "Con una estrategia de ciberseguridad por capas: control de accesos, cifrado, protección de endpoints, respaldo y monitoreo continuo, alineada con la normativa de protección de datos del sector salud." },
      { q: "¿Qué se necesita para habilitar telemedicina?", a: "Infraestructura confiable, conectividad robusta, plataformas seguras y alta disponibilidad para que la atención digital funcione sin interrupciones y protegiendo la información del paciente." },
      { q: "¿Cómo se garantiza la disponibilidad de los sistemas?", a: "Con arquitecturas de alta disponibilidad, respaldo automatizado y planes de recuperación ante desastres, de modo que los sistemas críticos sigan operando incluso ante incidentes." },
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
    faqs: [
      { q: "¿Por qué el sector financiero necesita ciberseguridad especializada?", a: "Porque maneja datos altamente sensibles y es uno de los blancos preferidos de los ciberataques. Requiere protección por capas, cumplimiento regulatorio y monitoreo continuo para proteger la operación y la confianza de los clientes." },
      { q: "¿Cómo se automatizan procesos financieros sin perder el control?", a: "Combinando RPA e inteligencia artificial con trazabilidad y controles: cada paso queda registrado para auditoría, manteniendo el cumplimiento normativo mientras se reducen errores y tiempos." },
      { q: "¿La tecnología ayuda al cumplimiento regulatorio?", a: "Sí. Muchos controles de seguridad (gestión de accesos, registro de actividad, protección de datos) son a la vez requisitos normativos, por lo que la tecnología facilita demostrar cumplimiento." },
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
    faqs: [
      { q: "¿Cómo mejora la tecnología la trazabilidad logística?", a: "Integrando sistemas y canales para tener información en tiempo real de cada etapa de la cadena, lo que permite anticipar problemas, optimizar rutas y dar visibilidad a clientes y operación." },
      { q: "¿Cómo se conectan varias sedes de forma segura?", a: "Con infraestructura de redes robusta y segmentada, conectividad multi-sede y seguridad por diseño, de modo que todas las ubicaciones operen como una sola red confiable." },
      { q: "¿Se pueden automatizar los procesos administrativos logísticos?", a: "Sí. Tareas como documentación, seguimiento de pedidos y conciliaciones se automatizan con RPA e integraciones, acelerando la operación y reduciendo errores." },
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
    faqs: [
      { q: "¿Qué tecnología necesita una institución educativa moderna?", a: "Conectividad robusta en campus, plataformas de aprendizaje confiables, herramientas de colaboración y ciberseguridad para proteger los datos de estudiantes y habilitar entornos híbridos." },
      { q: "¿Cómo se protege la información de los estudiantes?", a: "Con control de accesos, protección de datos, copias de seguridad y políticas de privacidad, garantizando el cumplimiento normativo y la confidencialidad de la información." },
      { q: "¿Cómo se habilita el aprendizaje híbrido?", a: "Combinando conectividad confiable, plataformas en la nube y herramientas de colaboración seguras para que docentes y estudiantes trabajen presencial y remotamente sin fricción." },
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
    faqs: [
      { q: "¿Qué es la omnicanalidad en retail?", a: "Es conectar todos los canales de venta y atención (tienda física, e-commerce, redes, soporte) en una experiencia coherente, de modo que el cliente transite entre ellos sin perder continuidad." },
      { q: "¿Cómo aumenta la tecnología las conversiones?", a: "Con ecosistemas digitales que integran canales, plataformas web rápidas y optimizadas, y analítica que permite personalizar la experiencia y reducir la fricción en la compra." },
      { q: "¿Se puede integrar el e-commerce con el inventario y la operación?", a: "Sí. Integramos tus plataformas de venta con inventario, logística y atención mediante APIs y automatización, evitando la gestión manual y los errores." },
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
    faqs: [
      { q: "¿Cómo se moderniza una entidad pública sin comprometer la seguridad?", a: "Con una transformación digital por fases que prioriza la ciberseguridad y la transparencia: se modernizan los procesos manteniendo el control, el cumplimiento y la protección de la información." },
      { q: "¿Qué beneficios trae la digitalización al sector público?", a: "Mayor eficiencia operativa, reducción de trámites manuales, mejor atención ciudadana digital y mayor transparencia y trazabilidad en los procesos." },
      { q: "¿Se puede mejorar la atención ciudadana con tecnología?", a: "Sí. Con portales y plataformas digitales, automatización de trámites y ecosistemas integrados que agilizan la interacción del ciudadano con la entidad." },
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
    faqs: [
      { q: "¿Por qué una firma de consultoría necesita infraestructura confiable?", a: "Porque su facturación depende de la disponibilidad y la productividad del equipo. El downtime se traduce en pérdidas directas, por lo que la estabilidad y el soporte continuo son críticos." },
      { q: "¿Cómo se protege la información confidencial de los clientes?", a: "Con ciberseguridad por capas, control de accesos, cifrado y políticas de protección de datos que garantizan la confidencialidad de la información sensible que maneja la firma." },
      { q: "¿Qué incluye el soporte tecnológico para servicios profesionales?", a: "Monitoreo 24/7, soporte y administración de infraestructura como servicio, para que el equipo trabaje sin interrupciones y con costos predecibles." },
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
    faqs: [
      { q: "¿Cómo puede una ONG aprovechar la tecnología con presupuesto limitado?", a: "Con soluciones escalables y económicas, principalmente en la nube, que permiten pagar por lo que se usa y crecer gradualmente, maximizando cada recurso para amplificar el impacto." },
      { q: "¿Cómo se protegen los datos de los beneficiarios?", a: "Con controles de ciberseguridad y protección de datos adecuados al tamaño de la organización: accesos, respaldo y buenas prácticas que cuidan la información sensible." },
      { q: "¿Qué herramientas ayudan a escalar el impacto social?", a: "Plataformas web, herramientas de colaboración accesibles y automatización que permiten llegar a más personas sin aumentar proporcionalmente los costos operativos." },
    ],
  },
};

export const industrySlugs = Object.keys(industriesContent);
