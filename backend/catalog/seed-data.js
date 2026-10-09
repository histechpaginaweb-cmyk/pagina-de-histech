// Initial catalog content. Every product fact below comes from HISTECH's own
// source material (RUT956 / RUT200 presentations); nothing else is asserted.
// Prices are NEVER seeded: products start as drafts with "consult price" so the
// owner reviews, completes (photos, price, SKU, datasheet) and publishes them
// from the admin.

const categories = [
  {
    slug: "routers-celulares-industriales",
    name: "Routers celulares industriales",
    description: "Routers 4G LTE para conectividad industrial, IoT y M2M en entornos exigentes.",
    sortOrder: 10,
  },
  {
    slug: "gateways-iot",
    name: "Gateways y dispositivos IoT",
    description: "Gateways para conectar equipos y sensores a plataformas de gestión.",
    sortOrder: 20,
  },
  {
    slug: "antenas-y-accesorios",
    name: "Antenas y accesorios",
    description: "Antenas, fuentes de poder y accesorios de instalación.",
    sortOrder: 30,
  },
];

const brands = [{ slug: "teltonika", name: "Teltonika", logoUrl: "/partners/teltonika.png" }];

const products = [
  {
    slug: "teltonika-rut956",
    name: "Teltonika RUT956",
    categorySlug: "routers-celulares-industriales",
    brandSlug: "teltonika",
    model: "RUT956",
    sku: null,
    shortDescription:
      "Router celular industrial 4G LTE con doble SIM, Wi-Fi, GNSS y puertos RS232/RS485, diseñado para operar entre -40 °C y 75 °C.",
    description: [
      "Conectividad industrial inteligente para soluciones IoT y M2M adaptadas a necesidades críticas.",
      "",
      "## Continuidad de la operación",
      "",
      "- **Doble SIM con auto-failover:** si la red principal falla o se debilita, cambia al operador de respaldo (Backup WAN).",
      "- **Transmisión segura:** compatible con túneles VPN industriales (WireGuard, ZeroTier, IPsec, Stunnel).",
      "",
      "## Conexión de equipos existentes",
      "",
      "Permite conectar maquinaria existente (PLC y sensores) mediante las interfaces RS232 y RS485, y enviar la telemetría a plataformas de gestión con protocolos industriales nativos (Modbus TCP/RTU, MQTT).",
      "",
      "## Gestión remota",
      "",
      "Con Teltonika RMS (Remote Management System) se supervisa la infraestructura desde un único panel: actualizaciones masivas de firmware, alertas, reinicios y acceso a terminales (SSH/HTTP).",
      "",
      "## Aplicaciones",
      "",
      "- Automatización de equipos legados, por ejemplo en tratamiento de aguas.",
      "- Telemetría móvil en transporte, combinando GNSS, cámaras por LAN y Wi-Fi a bordo.",
      "- Transmisión de datos ambientales por MQTT en climas hostiles.",
      "- Wi-Fi público solar en zonas rurales y ciudades inteligentes.",
    ].join("\n"),
    specs: [
      { label: "Red celular", value: "4G LTE Cat 4, 3G, 2G" },
      { label: "SIM", value: "Doble SIM con auto-failover (Backup WAN)" },
      { label: "Wi-Fi", value: "Integrado" },
      { label: "Ethernet", value: "4 puertos RJ45" },
      { label: "Interfaces industriales", value: "RS232, RS485" },
      { label: "Posicionamiento", value: "GNSS integrado" },
      { label: "Entradas/salidas digitales", value: "6 puertos" },
      { label: "Protocolos industriales", value: "Modbus TCP/RTU, MQTT" },
      { label: "VPN", value: "WireGuard, ZeroTier, IPsec, Stunnel" },
      { label: "Gestión remota", value: "Teltonika RMS" },
      { label: "Temperatura de operación", value: "-40 °C a 75 °C" },
    ],
    images: [
      { url: "/tienda/teltonika-rut956.webp", alt: "Router industrial Teltonika RUT956" },
      { url: "/tienda/teltonika-rut956-antenas.webp", alt: "Teltonika RUT956 con antenas móviles, Wi-Fi y GPS" },
    ],
    datasheetUrl: null,
    priceCop: null,
    consultPrice: true,
    availability: "on_request",
    status: "draft",
    featured: false,
    seoTitle: null,
    seoDescription: null,
  },
  {
    slug: "teltonika-rut200",
    name: "Teltonika RUT200",
    categorySlug: "routers-celulares-industriales",
    brandSlug: "teltonika",
    model: "RUT200",
    sku: null,
    shortDescription:
      "Router celular industrial 4G LTE compacto con Wi-Fi integrado y montaje en riel DIN, pensado para tableros de control y espacios reducidos.",
    description: [
      "Router celular industrial 4G LTE compacto, diseñado para misiones críticas en entornos rigurosos donde la conectividad ininterrumpida no es negociable.",
      "",
      "## Características",
      "",
      "- **Conectividad 4G LTE:** alta velocidad y baja latencia para transmisión de datos M2M e IoT.",
      "- **Wi-Fi integrado:** cobertura local confiable para acceso y configuración remota.",
      "- **Diseño industrial:** chasis robusto, optimizado para espacios reducidos y tableros de control.",
      "- **Instalación ágil:** conectores SMA para antenas Mobile y Wi-Fi, y sistema de montaje en riel DIN.",
      "",
      "## Aplicaciones",
      "",
      "- Conectividad de respaldo (failover) para sucursales remotas y cajeros automáticos.",
      "- Monitoreo remoto de infraestructuras críticas (SCADA) mediante transmisión M2M por LTE.",
      "- Puntos de acceso remotos y telemetría en sistemas de transporte de ciudades inteligentes.",
    ].join("\n"),
    specs: [
      { label: "Red celular", value: "4G LTE" },
      { label: "Wi-Fi", value: "Integrado" },
      { label: "Ethernet", value: "2 puertos WAN/LAN 10/100 Mbps" },
      { label: "Alimentación", value: "9-30 VDC, bloque de 4 pines" },
      { label: "SIM", value: "Bandeja SIM externa" },
      { label: "Antenas", value: "Conectores SMA (Mobile y Wi-Fi)" },
      { label: "Montaje", value: "Riel DIN" },
      { label: "Indicadores", value: "LEDs de estado (potencia, señal y red)" },
    ],
    images: [
      { url: "/tienda/teltonika-rut200.webp", alt: "Router industrial Teltonika RUT200" },
      { url: "/tienda/teltonika-rut200-4g.webp", alt: "Teltonika RUT200 con antenas SMA" },
    ],
    datasheetUrl: null,
    priceCop: null,
    consultPrice: true,
    availability: "on_request",
    status: "draft",
    featured: false,
    seoTitle: null,
    seoDescription: null,
  },
];

module.exports = { categories, brands, products };
