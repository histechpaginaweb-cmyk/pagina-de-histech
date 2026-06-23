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

module.exports = { isConfigured, readProducts, writeProducts, uploadImage };
