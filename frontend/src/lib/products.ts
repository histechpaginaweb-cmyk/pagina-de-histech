/**
 * Productos destacados que se muestran en el carrusel de la home.
 * Estos 6 registros son el SEED por defecto; la idea es que se puedan
 * gestionar desde un panel de administración (título, artículo breve e imagen).
 * Cuando exista el admin con persistencia, esta lista será el contenido inicial.
 */
export type Product = {
  id: string;
  /** Etiqueta corta (categoría) que se muestra sobre la tarjeta */
  badge?: string;
  title: string;
  /** Artículo/descripción breve */
  excerpt: string;
  /** Ruta a la imagen (en /public) o URL. Si está vacío se usa un placeholder. */
  image?: string;
  /** Ícono (lucide) usado en el placeholder cuando no hay imagen */
  icon?: string;
  /** Enlace opcional de "Leer más" */
  href?: string;
};

export const products: Product[] = [
  {
    id: "seguridad-gestionada",
    badge: "Ciberseguridad",
    title: "Seguridad perimetral gestionada",
    excerpt:
      "Firewall de nueva generación, control de acceso y monitoreo continuo para proteger tu red y tus datos frente a amenazas en evolución.",
    icon: "ShieldCheck",
    href: "/ciberseguridad",
  },
  {
    id: "backup-dr",
    badge: "Continuidad",
    title: "Respaldo y recuperación ante desastres",
    excerpt:
      "Copias automatizadas y planes de DR que mantienen tu operación en línea sin importar lo que ocurra. Recupera en minutos, no en días.",
    icon: "Cloud",
    href: "/cloud-continuidad",
  },
  {
    id: "microsoft-365",
    badge: "Productividad",
    title: "Microsoft 365 y licenciamiento",
    excerpt:
      "Implementación, migración y soporte de Microsoft 365 para que tu equipo colabore de forma segura desde cualquier lugar.",
    icon: "Workflow",
    href: "/transformacion-digital",
  },
  {
    id: "infraestructura",
    badge: "Infraestructura",
    title: "Servidores e infraestructura escalable",
    excerpt:
      "Infraestructura robusta, virtualización y alta disponibilidad diseñada a la medida de tu negocio para maximizar tu inversión.",
    icon: "Server",
    href: "/infraestructura-de-redes",
  },
  {
    id: "asistente-ia",
    badge: "Inteligencia Artificial",
    title: "Asistente de IA empresarial",
    excerpt:
      "Agentes inteligentes que automatizan tareas, responden a tus clientes y liberan a tu equipo para lo que realmente importa.",
    icon: "BrainCircuit",
    href: "/inteligencia-artificial",
  },
  {
    id: "soc-monitoreo",
    badge: "Operación 24/7",
    title: "Monitoreo y soporte 24/7",
    excerpt:
      "Vigilancia continua de tu infraestructura y respuesta proactiva ante incidentes, para que tu tecnología nunca te detenga.",
    icon: "Activity",
    href: "/servicios",
  },
];
