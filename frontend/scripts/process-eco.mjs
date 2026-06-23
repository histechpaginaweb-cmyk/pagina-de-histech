// Procesa la ilustración 3D del ecosistema (bloquedefigura.jpg) y difumina sus
// bordes a transparencia para fundirla con el fondo oscuro del Hero, sin borrar
// los textos de los módulos (feather mínimo en los lados).
// Uso: node scripts/process-eco.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const SRC = path.join(root, "bloquedefigura.jpg");
const OUT = path.join(root, "public", "hero-ecosystem.png");

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

// Feather por lado (fracción del tamaño). Arriba/abajo amplio (hay margen
// oscuro); izquierda/derecha mínimo para preservar los labels.
const fL = width * 0.025;
const fR = width * 0.025;
const fT = height * 0.1;
const fB = height * 0.09;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);

for (let y = 0; y < height; y++) {
  const aT = smooth(clamp01(y / fT));
  const aB = smooth(clamp01((height - y) / fB));
  for (let x = 0; x < width; x++) {
    const aL = smooth(clamp01(x / fL));
    const aR = smooth(clamp01((width - x) / fR));
    const a = Math.min(aL, aR, aT, aB);
    const idx = (y * width + x) * channels + 3;
    out[idx] = Math.round(out[idx] * a);
  }
}

const base = sharp(out, { raw: { width, height, channels } }).resize({
  width: 1240,
  withoutEnlargement: true,
});
await base.clone().png({ compressionLevel: 9 }).toFile(OUT);
await base
  .clone()
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(OUT.replace(/\.png$/, ".webp"));

console.log(`OK -> hero-ecosystem.png/.webp (${width}x${height})`);
