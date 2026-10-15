import { faqJsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string };

const PRICES = "Los precios publicados en la tienda incluyen IVA.";
const ADVISORY =
  "Si tienes dudas sobre qué modelo elegir, un asesor de HISTECH puede ayudarte a cotizar y dimensionar tu proyecto.";

/** Static Spanish copy per known category slug. Generic and factual: no specs or guarantees per model. */
const FAQS: Record<string, FaqItem[]> = {
  "switches-poe": [
    {
      q: "¿Qué es un switch PoE?",
      a: "Un switch PoE (Power over Ethernet) entrega datos y energía por el mismo cable de red, de modo que puedes alimentar cámaras IP, puntos de acceso Wi-Fi o teléfonos IP sin instalar un tomacorriente en cada equipo.",
    },
    {
      q: "¿Cómo elijo la cantidad de puertos y el presupuesto PoE?",
      a: "Cuenta los equipos que vas a conectar, suma la potencia que consume cada uno y compara el total con el presupuesto PoE del switch. Conviene dejar algunos puertos libres para crecer.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: `${PRICES} Si un producto muestra "Consultar precio", un asesor te confirma el valor.`,
    },
    {
      q: "¿Puedo recibir asesoría antes de comprar?",
      a: ADVISORY,
    },
  ],
  switches: [
    {
      q: "¿Qué diferencia hay entre un switch administrable y uno no administrable?",
      a: "Un switch administrable permite configurar VLAN, prioridades de tráfico y monitoreo. Uno no administrable funciona de forma directa, sin configuración, y suele bastar para redes pequeñas.",
    },
    {
      q: "¿Qué velocidad de puertos necesito?",
      a: "Los puertos Gigabit cubren la mayoría de redes de oficina. Los puertos de mayor velocidad, como SFP+, se usan sobre todo para enlaces entre switches o hacia servidores.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: PRICES,
    },
    {
      q: "¿Cómo puedo cotizar varios equipos?",
      a: ADVISORY,
    },
  ],
  "routers-firewalls": [
    {
      q: "¿Qué hace un router y qué hace un firewall?",
      a: "El router conecta tu red local con Internet y entre redes. El firewall filtra el tráfico según reglas de seguridad. Muchos equipos empresariales combinan ambas funciones.",
    },
    {
      q: "¿Cómo elijo un router o firewall para mi empresa?",
      a: "Ten en cuenta el ancho de banda de tu servicio de Internet, el número de usuarios y las funciones que necesitas, como VPN o balanceo de varios enlaces.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: PRICES,
    },
    {
      q: "¿HISTECH ofrece asesoría para elegir?",
      a: ADVISORY,
    },
  ],
  "transceptores-fibra": [
    {
      q: "¿Qué es un transceptor SFP?",
      a: "Es un módulo intercambiable que se inserta en un puerto SFP de un switch o router para conectar fibra óptica o cobre. Existen variantes como SFP, SFP+ y SFP28 según la velocidad.",
    },
    {
      q: "¿Cuál es la diferencia entre fibra monomodo y multimodo?",
      a: "La fibra monomodo se usa en distancias largas y la multimodo en distancias cortas dentro de un edificio o campus. El transceptor debe corresponder al tipo de fibra instalada.",
    },
    {
      q: "¿Qué debo verificar antes de comprar un transceptor?",
      a: "Revisa la velocidad del puerto, el tipo de conector, el tipo de fibra y la distancia del enlace. Ambos extremos del enlace deben ser compatibles entre sí.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: `${PRICES} ${ADVISORY}`,
    },
  ],
  "inyectores-poe": [
    {
      q: "¿Para qué sirve un inyector PoE?",
      a: "Agrega alimentación PoE a un enlace de red cuando tu switch no tiene puertos PoE. Se conecta entre el switch y el equipo que quieres alimentar.",
    },
    {
      q: "¿Cuándo conviene un inyector en lugar de un switch PoE?",
      a: "Para alimentar uno o pocos equipos, un inyector suele ser suficiente. Si vas a alimentar muchos equipos, un switch PoE centraliza la energía en un solo dispositivo.",
    },
    {
      q: "¿Cómo sé si el inyector es compatible con mi equipo?",
      a: "Verifica el estándar PoE y la potencia que requiere tu equipo en su ficha técnica, y compáralos con los del inyector.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: `${PRICES} ${ADVISORY}`,
    },
  ],
  "networking-industrial": [
    {
      q: "¿Qué es un equipo de red industrial?",
      a: "Son equipos de red pensados para operar en entornos exigentes, como plantas, bodegas o instalaciones a la intemperie, donde hay variaciones de temperatura, polvo o vibración.",
    },
    {
      q: "¿Qué debo revisar al elegir un equipo industrial?",
      a: "Consulta en la ficha técnica el rango de temperatura de operación, el tipo de montaje, la alimentación admitida y las interfaces disponibles.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: PRICES,
    },
    {
      q: "¿Puedo pedir ayuda para un proyecto industrial?",
      a: ADVISORY,
    },
  ],
  "convertidores-medios": [
    {
      q: "¿Qué es un convertidor de medios?",
      a: "Es un dispositivo que conecta dos tipos de medio físico distintos, por ejemplo cable de red de cobre con fibra óptica, para extender un enlace o integrar equipos con interfaces diferentes.",
    },
    {
      q: "¿Cuándo necesito un convertidor de medios?",
      a: "Cuando debes conectar un equipo con puerto de cobre a un enlace de fibra, o cuando necesitas cubrir una distancia mayor a la que permite el cable de red.",
    },
    {
      q: "¿Qué debo verificar antes de comprarlo?",
      a: "Revisa la velocidad, el tipo de fibra y de conector, y la distancia del enlace. Los dos extremos deben ser compatibles.",
    },
    {
      q: "¿Los precios incluyen IVA?",
      a: `${PRICES} ${ADVISORY}`,
    },
  ],
};

export const CATEGORY_FAQ_SLUGS = Object.keys(FAQS);

/** FAQ for a category slug, or undefined for unknown categories (no FAQ is rendered). */
export const getCategoryFaq = (slug: string): FaqItem[] | undefined => FAQS[slug];

/** FAQPage JSON-LD built from the same items as the visible section. */
export function categoryFaqJsonLd(faq: FaqItem[]) {
  return faqJsonLd(faq);
}
