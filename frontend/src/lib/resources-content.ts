/**
 * Centro de Conocimiento (GEO) — guías pilar de HISTECH.
 *
 * Contenido estructurado en TS (no MDX) para tener control total de la estructura
 * AEO/GEO (respuesta rápida, secciones, FAQ) y del schema (Article + FAQPage),
 * y para evitar el bug de next-mdx-remote en `next dev`.
 *
 * Cada guía está redactada como fuente confiable y citable por motores de IA:
 * explica primero, vende después. Los enlaces internos a servicios refuerzan el
 * Entity SEO (HISTECH ↔ IA, automatización, ciberseguridad, etc.).
 */

export type GuideSection = {
  /** Encabezado H2 de la sección. */
  heading: string;
  /** Párrafos del cuerpo. Admite enlaces markdown [texto](/ruta). */
  body?: string[];
  /** Lista de viñetas opcional. */
  bullets?: string[];
};

export type Guide = {
  slug: string;
  /** H1 + título visible. */
  title: string;
  /** Meta title optimizado (si difiere del title). */
  metaTitle: string;
  /** Meta description + resumen para el hub. */
  description: string;
  category: string;
  eyebrow: string;
  /** ISO date de publicación. */
  date: string;
  /** ISO date de última actualización. */
  updated: string;
  readingTime: string;
  /** Párrafo de entrada (lead). */
  intro: string;
  /** Respuesta rápida / TL;DR — clave para AEO y AI Overviews. */
  quickAnswer: string;
  /** Puntos clave (featured-snippet friendly). */
  keyPoints: string[];
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  /** Slugs de servicios relacionados (interlinking semántico). */
  relatedServices: string[];
  /** Slugs de otras guías relacionadas. */
  relatedGuides: string[];
  keywords: string[];
};

export const guides: Record<string, Guide> = {
  "como-implementar-inteligencia-artificial-empresa": {
    slug: "como-implementar-inteligencia-artificial-empresa",
    title: "¿Cómo implementar Inteligencia Artificial en una empresa?",
    metaTitle: "Cómo implementar Inteligencia Artificial en una empresa (guía paso a paso)",
    description:
      "Guía práctica para implementar IA en tu empresa: cómo elegir casos de uso, evaluar datos, hacer una prueba de concepto, integrar con seguridad y medir el retorno.",
    category: "Inteligencia Artificial",
    eyebrow: "Guía",
    date: "2026-06-24",
    updated: "2026-06-24",
    readingTime: "9 min",
    intro:
      "Implementar inteligencia artificial en una empresa no consiste en comprar una herramienta de moda, sino en resolver un problema real de negocio con datos. Esta guía explica, paso a paso, cómo pasar de la idea a una solución de IA en producción que genere valor medible.",
    quickAnswer:
      "Para implementar IA en una empresa, empieza por un caso de uso concreto y de alto impacto (no por la tecnología), valida que tienes datos suficientes, ejecuta una prueba de concepto medible en semanas, intégrala a tus sistemas con controles de seguridad y privacidad, y escala según los resultados. El éxito depende más de elegir bien el problema que del modelo que uses.",
    keyPoints: [
      "Empieza por el problema de negocio, no por la herramienta.",
      "Prioriza casos de uso por impacto y viabilidad de datos.",
      "Valida con una prueba de concepto (PoC) medible antes de escalar.",
      "Integra con seguridad, privacidad y cumplimiento desde el diseño.",
      "Mide el retorno (ROI) con indicadores definidos antes de empezar.",
    ],
    sections: [
      {
        heading: "¿Qué significa implementar IA en una empresa?",
        body: [
          "Implementar IA significa incorporar modelos y sistemas inteligentes —agentes, automatización, analítica predictiva o asistentes conversacionales— dentro de los procesos reales de la organización para que ejecuten tareas, anticipen resultados o apoyen decisiones.",
          "La diferencia entre una demo y una implementación real está en la integración: la IA debe conectarse a tus datos y sistemas, operar de forma confiable y medirse con indicadores de negocio. Sin esa integración, una iniciativa de IA se queda en experimento.",
        ],
      },
      {
        heading: "El error más común: empezar por la tecnología",
        body: [
          "La mayoría de los proyectos de IA fracasan porque arrancan preguntando \"¿qué modelo usamos?\" en lugar de \"¿qué proceso pierde tiempo, genera errores o cuesta demasiado?\". La IA es un medio, no un fin.",
          "El punto de partida correcto es el negocio: identificar dónde la automatización o la predicción liberarían más valor. Recién entonces se elige la tecnología adecuada.",
        ],
      },
      {
        heading: "Paso 1: Identificar casos de uso de alto impacto",
        body: [
          "Haz un inventario de procesos candidatos y puntúalos por dos ejes: impacto en el negocio (ahorro de tiempo, reducción de errores, aumento de ingresos) y viabilidad (disponibilidad de datos y complejidad técnica). Los mejores primeros proyectos están en el cruce de alto impacto y alta viabilidad.",
        ],
        bullets: [
          "Atención al cliente: asistentes que responden consultas frecuentes y califican prospectos.",
          "Procesamiento de documentos: extracción y validación de facturas, contratos y formularios.",
          "Pronóstico: predicción de demanda, rotación de inventario o riesgo de cartera.",
          "Operaciones: detección de anomalías y mantenimiento predictivo.",
        ],
      },
      {
        heading: "Paso 2: Evaluar tus datos y la viabilidad",
        body: [
          "La IA se alimenta de datos. Antes de invertir, evalúa si tienes información suficiente, accesible y de calidad razonable. No necesitas un \"lago de datos\" perfecto para empezar: un caso de uso bien acotado puede funcionar con un conjunto modesto pero limpio.",
          "Si los datos están dispersos entre sistemas que no se comunican, conviene primero conectar esas fuentes. Ahí es donde un proyecto de [ecosistemas digitales](/ecosistemas-digitales) habilita el terreno para la IA.",
        ],
      },
      {
        heading: "Paso 3: Ejecutar una prueba de concepto (PoC) medible",
        body: [
          "Antes de comprometer un presupuesto grande, valida la hipótesis con una prueba de concepto sobre datos reales, con un alcance pequeño y un plazo de semanas, no meses. Define desde el inicio qué métrica decidirá si la PoC fue exitosa (por ejemplo, porcentaje de documentos procesados sin intervención humana).",
          "Una PoC bien diseñada reduce el riesgo: si funciona, tienes evidencia para escalar; si no, aprendiste rápido y barato.",
        ],
      },
      {
        heading: "Paso 4: Integrar con seguridad y escalar",
        body: [
          "Una vez validada, la solución se integra a tus sistemas con controles de seguridad, privacidad de datos y cumplimiento normativo desde el diseño. Esto incluye gestión de accesos, registro de auditoría y protección de la información sensible que procesa el modelo.",
          "El escalado es progresivo: se amplía a más volumen, más usuarios o nuevos procesos, midiendo resultados en cada fase. La [ciberseguridad](/ciberseguridad) deja de ser opcional cuando la IA toca datos críticos.",
        ],
      },
      {
        heading: "¿Cuánto cuesta y cuánto tarda implementar IA?",
        body: [
          "No existe un precio único: el costo depende del caso de uso, la madurez de los datos, el nivel de integración y si se usan modelos preexistentes o a la medida. Por eso la inversión inicial debe dimensionarse contra el retorno esperado, no contra una tarifa de catálogo.",
          "En cuanto a tiempos, un enfoque por fases permite ver valor temprano: una primera PoC puede entregar resultados en semanas, mientras que una adopción amplia es un recorrido continuo de mejora.",
        ],
      },
      {
        heading: "Cómo HISTECH acompaña la implementación",
        body: [
          "En HISTECH implementamos IA aplicada a procesos reales, no demos genéricas. Identificamos el caso de uso, validamos con una prueba de concepto, integramos con seguridad y medimos el retorno. Conoce el detalle en [Inteligencia Artificial Empresarial](/inteligencia-artificial) o, si aún no sabes por dónde empezar, en [Consultoría en IT](/consultoria-it).",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Mi empresa necesita muchos datos para usar IA?",
        a: "No necesariamente. Un caso de uso bien acotado puede funcionar con un conjunto de datos modesto pero limpio. Lo importante es la calidad y la pertinencia, no solo el volumen. Se empieza pequeño y se escala con resultados.",
      },
      {
        q: "¿La IA va a reemplazar a mi equipo?",
        a: "El objetivo de la IA empresarial es automatizar tareas repetitivas para que las personas se enfoquen en lo estratégico. Aumenta la capacidad del equipo en lugar de reemplazar su criterio.",
      },
      {
        q: "¿Es seguro darle nuestros datos a un sistema de IA?",
        a: "Sí, si se implementa con controles de seguridad, privacidad y cumplimiento desde el diseño: gestión de accesos, cifrado, auditoría y políticas de tratamiento de datos. La seguridad debe ser parte del proyecto, no un agregado posterior.",
      },
      {
        q: "¿Cuál es el primer paso para implementar IA?",
        a: "Identificar un proceso concreto que pierda tiempo, genere errores o cueste demasiado, y validar que existen datos para abordarlo. Ese caso de uso, no la tecnología, es el verdadero punto de partida.",
      },
    ],
    relatedServices: ["inteligencia-artificial", "ecosistemas-digitales", "consultoria-it"],
    relatedGuides: ["automatizacion-empresarial-beneficios-costos-casos-de-uso"],
    keywords: [
      "cómo implementar inteligencia artificial en una empresa",
      "implementación de IA empresarial",
      "casos de uso de IA",
      "prueba de concepto IA",
      "inteligencia artificial para empresas Colombia",
    ],
  },

  "automatizacion-empresarial-beneficios-costos-casos-de-uso": {
    slug: "automatizacion-empresarial-beneficios-costos-casos-de-uso",
    title: "Automatización empresarial: beneficios, costos y casos de uso",
    metaTitle: "Automatización empresarial: beneficios, costos y casos de uso",
    description:
      "Qué es la automatización empresarial, qué beneficios aporta, cuánto cuesta, cómo calcular el ROI y los casos de uso más rentables por área de la empresa.",
    category: "Automatización",
    eyebrow: "Guía",
    date: "2026-06-24",
    updated: "2026-06-24",
    readingTime: "8 min",
    intro:
      "La automatización empresarial permite que el software ejecute tareas repetitivas que hoy consumen horas de tu equipo, con menos errores y disponibilidad permanente. Esta guía explica qué es, qué beneficios reales aporta, cómo se estima su costo y dónde conviene empezar.",
    quickAnswer:
      "La automatización empresarial combina herramientas como RPA e inteligencia artificial para ejecutar tareas repetitivas (facturación, validaciones, reportes, atención) sin intervención manual. Sus principales beneficios son reducción de errores, ahorro de tiempo, disponibilidad 24/7 y escalabilidad sin aumentar personal. El costo depende del número y la complejidad de los procesos, y el retorno suele medirse en las horas-persona liberadas y los errores evitados.",
    keyPoints: [
      "Automatizar = ejecutar tareas repetitivas con software, sin intervención manual.",
      "Beneficios: menos errores, ahorro de tiempo, operación 24/7 y escalabilidad.",
      "Las áreas con mayor retorno suelen ser finanzas, operaciones y atención al cliente.",
      "El ROI se calcula con las horas liberadas y los errores evitados.",
      "Conviene empezar por un proceso de alto volumen y reglas claras.",
    ],
    sections: [
      {
        heading: "¿Qué es la automatización empresarial?",
        body: [
          "La automatización empresarial es el uso de tecnología para ejecutar procesos de negocio con mínima o nula intervención humana. Abarca desde la automatización robótica de procesos (RPA), que imita acciones humanas en aplicaciones, hasta la automatización inteligente, que añade IA para interpretar, decidir y aprender.",
          "A diferencia de un simple script, una solución de automatización se integra a tus sistemas, opera de forma confiable y se monitorea. El objetivo no es solo \"hacer lo mismo más rápido\", sino rediseñar el flujo para eliminar pasos innecesarios.",
        ],
      },
      {
        heading: "Beneficios medibles de automatizar",
        bullets: [
          "Reducción drástica de errores operativos en tareas repetitivas.",
          "Ahorro de tiempo: el equipo deja las tareas manuales y se enfoca en lo estratégico.",
          "Disponibilidad 24/7: los procesos no dependen del horario laboral.",
          "Escalabilidad: absorber más volumen sin aumentar proporcionalmente el personal.",
          "Trazabilidad: cada paso queda registrado para auditoría y mejora.",
          "Mejor experiencia: respuestas más rápidas para clientes y colaboradores.",
        ],
      },
      {
        heading: "Casos de uso por área de la empresa",
        body: [
          "La automatización aporta valor en casi todas las áreas. Estos son los casos de uso con mayor retorno habitual:",
        ],
        bullets: [
          "Finanzas: conciliaciones, validación y registro de facturas, generación de reportes.",
          "Operaciones: actualización de inventarios, órdenes de compra, seguimiento de pedidos.",
          "Atención al cliente: respuestas a consultas frecuentes y calificación de prospectos.",
          "Recursos humanos: onboarding, gestión de solicitudes y novedades de nómina.",
          "Administración: extracción de datos de documentos y carga entre sistemas.",
        ],
      },
      {
        heading: "¿Cuánto cuesta automatizar un proceso?",
        body: [
          "El costo de la automatización depende de cuántos procesos se automatizan, su complejidad, el número de sistemas involucrados y si requieren componentes de IA. Un proceso de reglas claras y un solo sistema es más económico que uno que cruza varias plataformas y exige interpretación.",
          "Por eso conviene dimensionar la inversión contra el ahorro esperado y no contra una tarifa fija. Un buen proyecto se paga con las horas-persona que libera y los errores costosos que evita.",
        ],
      },
      {
        heading: "Cómo calcular el retorno (ROI)",
        body: [
          "Una forma sencilla de estimar el retorno: multiplica las horas mensuales que hoy consume el proceso por el costo de esas horas, súmale el costo de los errores que se evitarían, y compáralo con la inversión y el mantenimiento de la automatización.",
          "Define la métrica antes de empezar (por ejemplo, porcentaje de transacciones procesadas sin intervención) para poder demostrar el valor con datos.",
        ],
      },
      {
        heading: "Cómo empezar sin riesgo",
        body: [
          "Empieza por un proceso de alto volumen, repetitivo y con reglas claras; valida con un piloto medible y escala a partir de los resultados. Cuando los procesos cruzan varios sistemas, primero hay que conectarlos: ahí entran los [ecosistemas digitales](/ecosistemas-digitales) y, cuando hay que interpretar o decidir, la [inteligencia artificial](/inteligencia-artificial).",
          "Si la automatización es parte de un cambio más amplio en cómo opera la empresa, conviene enmarcarla dentro de un plan de [transformación digital](/transformacion-digital).",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Qué es RPA?",
        a: "RPA (Robotic Process Automation) es software que automatiza tareas repetitivas imitando las acciones que una persona haría en las aplicaciones: copiar datos, llenar formularios, mover información entre sistemas. Combinado con IA, además puede interpretar y decidir.",
      },
      {
        q: "¿La automatización sirve para pequeñas y medianas empresas?",
        a: "Sí. Las pymes suelen tener procesos manuales de alto volumen donde la automatización genera un retorno rápido. No se necesita una gran infraestructura: se empieza por un proceso concreto y se escala.",
      },
      {
        q: "¿Cuánto tiempo toma automatizar un proceso?",
        a: "Depende de la complejidad, pero un proceso acotado puede automatizarse en semanas mediante un piloto. Lo recomendable es avanzar por fases con entregables tempranos.",
      },
      {
        q: "¿Automatizar significa despedir personal?",
        a: "El objetivo es liberar a las personas de tareas repetitivas para que aporten en actividades de mayor valor. La mayoría de las empresas reasigna ese tiempo a tareas estratégicas en lugar de reducir su equipo.",
      },
    ],
    relatedServices: ["automatizacion-empresarial", "inteligencia-artificial", "ecosistemas-digitales"],
    relatedGuides: ["como-implementar-inteligencia-artificial-empresa"],
    keywords: [
      "automatización empresarial",
      "automatización de procesos",
      "RPA",
      "beneficios de la automatización",
      "costos de automatización",
    ],
  },

  "ciberseguridad-empresarial-guia-completa": {
    slug: "ciberseguridad-empresarial-guia-completa",
    title: "Ciberseguridad empresarial: guía completa para proteger una organización",
    metaTitle: "Ciberseguridad empresarial: guía completa para proteger tu empresa",
    description:
      "Guía completa de ciberseguridad empresarial: principales amenazas, capas de protección, marco de trabajo, cumplimiento en Colombia y cómo evaluar tu postura de seguridad.",
    category: "Ciberseguridad",
    eyebrow: "Guía",
    date: "2026-06-24",
    updated: "2026-06-24",
    readingTime: "10 min",
    intro:
      "La ciberseguridad empresarial es el conjunto de prácticas, controles y tecnologías que protegen la información, los sistemas y la operación de una organización frente a amenazas digitales. Esta guía explica qué proteger, de qué amenazas, con qué capas y cómo empezar.",
    quickAnswer:
      "Proteger una empresa requiere un enfoque por capas: seguridad de perímetro y red, protección de endpoints, control de identidades y accesos con mínimo privilegio, protección de datos y respaldos, y monitoreo continuo para detectar y responder a incidentes. No es un producto único, sino una estrategia que combina tecnología, procesos y personas, alineada con el riesgo real de cada organización.",
    keyPoints: [
      "La ciberseguridad es estrategia por capas, no un solo producto.",
      "Ninguna empresa es demasiado pequeña para ser un objetivo.",
      "Las capas clave: perímetro, endpoints, identidad, datos y respaldo.",
      "El respaldo y la recuperación son tu última línea ante ransomware.",
      "Todo empieza con una evaluación de la postura de seguridad actual.",
    ],
    sections: [
      {
        heading: "¿Qué es la ciberseguridad empresarial?",
        body: [
          "La ciberseguridad empresarial protege tres cosas: la confidencialidad de la información (que solo accedan quienes deben), su integridad (que no se altere indebidamente) y su disponibilidad (que esté accesible cuando se necesita). Estos tres principios guían cualquier estrategia de seguridad.",
          "No se trata únicamente de tecnología: incluye procesos (cómo se gestionan accesos e incidentes) y personas (la concienciación del equipo, que sigue siendo el factor más explotado por los atacantes).",
        ],
      },
      {
        heading: "Las principales amenazas hoy",
        bullets: [
          "Ransomware: cifrado de datos para exigir un rescate; una de las amenazas más costosas.",
          "Phishing e ingeniería social: engaños para robar credenciales o autorizar pagos.",
          "Fuga de datos: exposición de información sensible por errores o accesos indebidos.",
          "Ataques a credenciales: contraseñas débiles o reutilizadas, sin segundo factor.",
          "Vulnerabilidades sin parchar: sistemas desactualizados que abren la puerta.",
        ],
      },
      {
        heading: "Las capas de protección",
        body: [
          "Una defensa sólida no depende de un solo control, sino de varias capas que se respaldan entre sí. Si una falla, otra contiene el impacto:",
        ],
        bullets: [
          "Perímetro y red: firewalls de próxima generación y segmentación.",
          "Endpoints y servidores: protección avanzada contra malware y ransomware.",
          "Identidad y acceso: autenticación multifactor y principio de mínimo privilegio.",
          "Datos: cifrado y políticas de tratamiento de información sensible.",
          "Respaldo y recuperación: copias confiables y un plan de recuperación probado.",
        ],
      },
      {
        heading: "Un marco de trabajo: identificar, proteger, detectar, responder, recuperar",
        body: [
          "Los marcos de ciberseguridad reconocidos organizan el trabajo en cinco funciones: identificar los activos y riesgos, proteger con controles, detectar incidentes a tiempo, responder para contenerlos y recuperar la operación. Adoptar este ciclo evita el error de invertir solo en \"muros\" y olvidar la detección y la recuperación.",
          "El monitoreo continuo es lo que convierte la seguridad de algo estático en algo vivo: detectar y contener un incidente a tiempo marca la diferencia entre un susto y una crisis.",
        ],
      },
      {
        heading: "Cumplimiento normativo en Colombia",
        body: [
          "En Colombia, el tratamiento de datos personales está regulado por la Ley 1581 de 2012 y sus decretos reglamentarios, que obligan a las organizaciones a proteger la información personal que recopilan. Además, sectores como el financiero o el de salud tienen exigencias adicionales.",
          "La ciberseguridad y el cumplimiento van de la mano: muchos de los controles que exige la normativa (gestión de accesos, protección de datos, registro de actividad) son, además, buenas prácticas de seguridad.",
        ],
      },
      {
        heading: "Errores comunes (sobre todo en pymes)",
        bullets: [
          "Creer que la empresa es \"demasiado pequeña\" para ser un objetivo.",
          "Confiar solo en un antivirus y ningún otro control.",
          "No tener copias de seguridad o no probar nunca la recuperación.",
          "No usar autenticación multifactor en correo y accesos críticos.",
          "Posponer las actualizaciones y los parches de seguridad.",
        ],
      },
      {
        heading: "Cómo evaluar tu postura de seguridad",
        body: [
          "El punto de partida no es comprar productos, sino entender dónde estás: una evaluación de la postura de seguridad identifica vulnerabilidades, riesgos y los controles de mayor impacto para tu caso. A partir de ese diagnóstico se prioriza la inversión.",
          "En HISTECH diseñamos estrategias de [ciberseguridad](/ciberseguridad) a la medida de cada infraestructura, reforzadas con [cloud y continuidad](/cloud-continuidad) para el respaldo y la recuperación, y con [servicios gestionados](/managed-services) para el monitoreo 24/7.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Mi empresa es demasiado pequeña para ser un objetivo?",
        a: "No. De hecho, las pymes suelen ser blanco preferido porque tienen menos defensas. La automatización del cibercrimen no discrimina por tamaño: ataca a quien esté expuesto.",
      },
      {
        q: "¿Con un antivirus es suficiente?",
        a: "No. El antivirus es una capa más, pero la protección efectiva requiere varias: perímetro, control de accesos, protección de datos, respaldo y monitoreo. Depender de un solo control deja huecos.",
      },
      {
        q: "¿Qué hago primero para mejorar mi ciberseguridad?",
        a: "Empieza por una evaluación de tu postura de seguridad actual. A partir del diagnóstico se priorizan los controles de mayor impacto, en lugar de invertir a ciegas.",
      },
      {
        q: "¿Cómo me protejo del ransomware?",
        a: "Con una combinación de protección de endpoints y correo, autenticación multifactor, actualizaciones al día y, sobre todo, copias de seguridad confiables y un plan de recuperación probado. El respaldo es tu última línea de defensa.",
      },
    ],
    relatedServices: ["ciberseguridad", "cloud-continuidad", "managed-services"],
    relatedGuides: ["como-implementar-inteligencia-artificial-empresa"],
    keywords: [
      "ciberseguridad empresarial",
      "cómo proteger una empresa de ciberataques",
      "guía de ciberseguridad",
      "protección contra ransomware",
      "ciberseguridad para empresas Colombia",
    ],
  },
};

export const guideSlugs = Object.keys(guides);
