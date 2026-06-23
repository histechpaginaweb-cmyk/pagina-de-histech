// ─────────────────────────────────────────────────────────────
// Persistencia en Cloudflare R2 (compatible con S3).
// R2 guarda DOS cosas:
//   - products.json  → los datos de las tarjetas del carrusel
//   - products/<id>.<ext> → las imágenes subidas desde el admin
// No hay base de datos: R2 es el único almacén.
// ─────────────────────────────────────────────────────────────
const crypto = require("crypto");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

const PRODUCTS_KEY = "products.json";

// ¿Están todas las credenciales necesarias?
const isConfigured = () =>
  Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET);

const client = isConfigured()
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Los 6 productos por defecto. Se escriben en R2 la primera vez (cuando aún
// no existe products.json), para no arrancar con el carrusel vacío.
const SEED = [
  {
    id: "seguridad-gestionada",
    badge: "Ciberseguridad",
    title: "Seguridad perimetral gestionada",
    excerpt:
      "Firewall de nueva generación, control de acceso y monitoreo continuo para proteger tu red y tus datos frente a amenazas en evolución.",
    image: "",
    icon: "ShieldCheck",
    href: "/ciberseguridad",
    position: 1,
  },
  {
    id: "backup-dr",
    badge: "Continuidad",
    title: "Respaldo y recuperación ante desastres",
    excerpt:
      "Copias automatizadas y planes de DR que mantienen tu operación en línea sin importar lo que ocurra. Recupera en minutos, no en días.",
    image: "",
    icon: "Cloud",
    href: "/cloud-continuidad",
    position: 2,
  },
  {
    id: "microsoft-365",
    badge: "Productividad",
    title: "Microsoft 365 y licenciamiento",
    excerpt:
      "Implementación, migración y soporte de Microsoft 365 para que tu equipo colabore de forma segura desde cualquier lugar.",
    image: "",
    icon: "Workflow",
    href: "/transformacion-digital",
    position: 3,
  },
  {
    id: "infraestructura",
    badge: "Infraestructura",
    title: "Servidores e infraestructura escalable",
    excerpt:
      "Infraestructura robusta, virtualización y alta disponibilidad diseñada a la medida de tu negocio para maximizar tu inversión.",
    image: "",
    icon: "Server",
    href: "/infraestructura-de-redes",
    position: 4,
  },
  {
    id: "asistente-ia",
    badge: "Inteligencia Artificial",
    title: "Asistente de IA empresarial",
    excerpt:
      "Agentes inteligentes que automatizan tareas, responden a tus clientes y liberan a tu equipo para lo que realmente importa.",
    image: "",
    icon: "BrainCircuit",
    href: "/inteligencia-artificial",
    position: 5,
  },
  {
    id: "soc-monitoreo",
    badge: "Operación 24/7",
    title: "Monitoreo y soporte 24/7",
    excerpt:
      "Vigilancia continua de tu infraestructura y respuesta proactiva ante incidentes, para que tu tecnología nunca te detenga.",
    image: "",
    icon: "Activity",
    href: "/servicios",
    position: 6,
  },
];

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

/** Lee el array de productos desde R2. Si no existe, lo siembra. */
async function readProducts() {
  // Sin R2 configurado (p.ej. local sin credenciales) → seed en memoria.
  if (!client) return SEED.map((p) => ({ ...p }));

  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: PRODUCTS_KEY }),
    );
    const body = await streamToString(res.Body);
    const arr = JSON.parse(body);
    if (!Array.isArray(arr)) throw new Error("products.json con formato inválido");
    return arr;
  } catch (err) {
    const notFound =
      err?.name === "NoSuchKey" ||
      err?.Code === "NoSuchKey" ||
      err?.$metadata?.httpStatusCode === 404;
    if (notFound) {
      // Primera vez: sembramos los 6 productos por defecto.
      const seed = SEED.map((p) => ({ ...p }));
      await writeProducts(seed);
      return seed;
    }
    throw err;
  }
}

/** Sobrescribe products.json en R2 con el array dado. */
async function writeProducts(products) {
  if (!client) throw new Error("R2 no está configurado en el servidor");
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: PRODUCTS_KEY,
      Body: JSON.stringify(products, null, 2),
      ContentType: "application/json",
    }),
  );
}

/** Sube un buffer de imagen a R2 y devuelve su URL pública. */
async function uploadImage(buffer, mimetype) {
  if (!client) throw new Error("R2 no está configurado en el servidor");
  if (!R2_PUBLIC_URL) {
    throw new Error("Falta R2_PUBLIC_URL (URL pública del bucket)");
  }
  const ext = (mimetype && mimetype.split("/")[1]) || "jpg";
  const key = `products/${crypto.randomUUID()}.${ext}`;
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype || "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

// ─────────────────────────────────────────────────────────────
// TEXTOS DE LAS PÁGINAS DE SERVICIO (editables desde el admin).
// Solo texto: title / subtitle / intro por cada slug de servicio.
// El frontend los mezcla con su contenido estático (fallback).
// ─────────────────────────────────────────────────────────────
const SERVICE_TEXTS_KEY = "service-texts.json";

const SERVICE_TEXTS_SEED = [
  {
    slug: "inteligencia-artificial",
    name: "Inteligencia Artificial Empresarial",
    title: "Inteligencia Artificial que trabaja por tu empresa",
    subtitle:
      "Automatización, agentes inteligentes y analítica avanzada para que tu organización decida más rápido y opere con menos fricción.",
    intro:
      "La inteligencia artificial dejó de ser una promesa futura: hoy es una ventaja competitiva. En HISTECH implementamos soluciones de IA aplicadas a tus procesos reales —no demos genéricas— para automatizar tareas, eliminar errores y convertir tus datos en decisiones.",
  },
  {
    slug: "transformacion-digital",
    name: "Transformación Digital",
    title: "Modernizamos tu empresa con estrategia y tecnología",
    subtitle:
      "Metodologías probadas para evolucionar tu operación con innovación, automatización y una hoja de ruta clara.",
    intro:
      "La transformación digital no se trata de comprar tecnología, sino de rediseñar cómo opera tu empresa. Te acompañamos con una estrategia clara, medible y alineada con tus objetivos de negocio.",
  },
  {
    slug: "ecosistemas-digitales",
    name: "Ecosistemas Digitales",
    title: "Conectamos personas, procesos, datos y tecnología",
    subtitle:
      "Diseñamos ecosistemas donde toda tu organización trabaja en sincronía, con información en tiempo real y automatización inteligente.",
    intro:
      "Una empresa eficiente no tiene islas de información. Construimos ecosistemas digitales que integran tus sistemas, automatizan tus procesos y unifican tus datos para que todo fluya.",
  },
  {
    slug: "ciberseguridad",
    name: "Ciberseguridad",
    title: "Protegemos lo más valioso: tu información",
    subtitle:
      "Soluciones de seguridad precisas, basadas en el análisis profundo de tu entorno, tus riesgos y tus controles existentes.",
    intro:
      "En ciberseguridad, lo único constante es la evolución de las amenazas. Por eso no aplicamos plantillas: diseñamos una estrategia de seguridad a la medida de tu infraestructura para fortalecer tu operación y la confianza de tus clientes.",
  },
  {
    slug: "cloud-continuidad",
    name: "Cloud y Continuidad",
    title: "Tu negocio, siempre disponible",
    subtitle:
      "Nube híbrida, respaldo y recuperación ante desastres para que tu operación nunca se detenga.",
    intro:
      "La continuidad de tu negocio depende de una infraestructura resiliente. Diseñamos arquitecturas cloud seguras y confiables, con respaldo y recuperación, para que accedas a tus datos desde cualquier lugar, en cualquier momento.",
  },
  {
    slug: "infraestructura-de-redes",
    name: "Infraestructura de Redes",
    title: "La base sólida que sostiene tu operación",
    subtitle:
      "Conectividad confiable y robusta que comienza con un entendimiento profundo de tu entorno.",
    intro:
      "Deja la infraestructura de tu empresa en manos expertas. Diseñamos soluciones de red personalizadas —zero-touch, de alta calidad y con networking inteligente— para maximizar tu inversión y garantizar una experiencia de usuario óptima.",
  },
  {
    slug: "computo",
    name: "Cómputo",
    title: "La eficiencia comienza con el equipo adecuado",
    subtitle:
      "Soluciones de cómputo confiables y escalables, desde estaciones corporativas hasta servidores de centro de datos.",
    intro:
      "La productividad de tu equipo depende de las herramientas adecuadas. Ofrecemos una amplia gama de soluciones de cómputo corporativo y servidores, optimizadas para el rendimiento y la efectividad operativa en entornos híbridos y de alta demanda.",
  },
  {
    slug: "consultoria-it",
    name: "Consultoría en IT",
    title: "Asesoría experta para cada decisión tecnológica",
    subtitle:
      "¿No sabes por dónde iniciar? Te asesoramos de forma directa, capacitamos a tu equipo y logramos que tu empresa adopte el cambio.",
    intro:
      "La tecnología solo genera valor cuando se adopta bien. Actuamos como tu CIO virtual: combinamos experiencia técnica y de negocio para diagnosticar, recomendar y acompañar cada paso de tu evolución tecnológica.",
  },
  {
    slug: "managed-services",
    name: "Servicios Gestionados",
    title: "Un equipo de expertos cuidando tu tecnología",
    subtitle:
      "Monitoreo 24/7, soporte y administración de infraestructura con costos predecibles y tranquilidad total.",
    intro:
      "¿Por qué contratar a una sola persona de TI cuando puedes tener todo un equipo de expertos por una fracción del costo? Nos encargamos de tu tecnología para que tú te enfoques en hacer crecer tu negocio.",
  },
  {
    slug: "soluciones-web",
    name: "Soluciones Web",
    title: "Plataformas web de alto rendimiento",
    subtitle:
      "Sitios y aplicaciones web modernas, seguras y escalables que impulsan tu presencia digital y tus conversiones.",
    intro:
      "Tu plataforma web es la cara digital de tu empresa. Diseñamos y desarrollamos experiencias web rápidas, seguras y optimizadas para conversión, con las mejores prácticas de rendimiento, SEO y accesibilidad.",
  },
];

/** Lee los textos de servicio desde R2. Si no existe, los siembra. */
async function readServiceTexts() {
  if (!client) return SERVICE_TEXTS_SEED.map((s) => ({ ...s }));
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: SERVICE_TEXTS_KEY }),
    );
    const arr = JSON.parse(await streamToString(res.Body));
    if (!Array.isArray(arr)) throw new Error("service-texts.json inválido");
    return arr;
  } catch (err) {
    const notFound =
      err?.name === "NoSuchKey" ||
      err?.Code === "NoSuchKey" ||
      err?.$metadata?.httpStatusCode === 404;
    if (notFound) {
      const seed = SERVICE_TEXTS_SEED.map((s) => ({ ...s }));
      await writeServiceTexts(seed);
      return seed;
    }
    throw err;
  }
}

/** Sobrescribe service-texts.json en R2. */
async function writeServiceTexts(items) {
  if (!client) throw new Error("R2 no está configurado en el servidor");
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: SERVICE_TEXTS_KEY,
      Body: JSON.stringify(items, null, 2),
      ContentType: "application/json",
    }),
  );
}

module.exports = {
  isConfigured,
  readProducts,
  writeProducts,
  uploadImage,
  readServiceTexts,
  writeServiceTexts,
};
