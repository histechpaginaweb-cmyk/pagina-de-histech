// Subida y optimización de imágenes del Portal (adjuntos de tickets).
// - Solo imágenes (jpeg/png/webp/gif). Máx. 2 por ticket (se valida en la ruta).
// - Optimiza con sharp (redimensiona y convierte a WebP) antes de almacenar.
// - Almacena en Cloudflare R2 bajo el prefijo `portal/tickets/` (aislado de los
//   productos del sitio). Reutiliza las credenciales R2 del backend.
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { HttpError } = require("./http");

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB por imagen (antes de optimizar)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const storageConfigured = () =>
  Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_URL);

const client = storageConfigured()
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Multer en memoria: solo imágenes, con límite de tamaño.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 2 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true);
    cb(new HttpError(400, "Solo se permiten imágenes (JPG, PNG, WebP o GIF)."));
  },
});

// Optimiza un buffer de imagen y lo sube a R2. Devuelve la URL pública.
async function optimizeAndUpload(buffer) {
  if (!client) {
    throw new HttpError(500, "El almacenamiento de imágenes no está configurado.");
  }
  const optimized = await sharp(buffer)
    .rotate() // respeta la orientación EXIF
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();

  const key = `portal/tickets/${crypto.randomUUID()}.webp`;
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: optimized,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

module.exports = { upload, optimizeAndUpload, storageConfigured };
