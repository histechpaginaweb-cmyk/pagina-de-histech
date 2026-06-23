// Convierte el logo oficial MASTER (logo-histech.jpg) en PNG/WebP transparente.
// FUENTE: logo-histech.jpg = render LIMPIO sobre fondo BLANCO, con degradado
// azul→púrpura, bordes nítidos y SIN glow (look corporativo elegido por el
// usuario, "Opción B"). NO se usa fondoclaro.jpg (ese trae glow rosado horneado).
//
// Pipeline:
//   - white-to-alpha por canal MÍNIMO: blanco puro (min alto) → transparente;
//     el logo saturado (min bajo) → opaco. Banda suave 205→245 para anti-alias.
//   - NO se altera el color: se respeta el degradado/bordes originales.
//   - de-fringe leve: en píxeles semi-transparentes resta un poco del blanco
//     para que el borde no quede con halo claro sobre el fondo oscuro.
// Uso: node scripts/process-logo.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const SRC = path.join(root, "assets-fuente", "logo-histech.jpg");
const OUT = path.join(root, "public", "logo-histech.png");

const WLO = 205; // min de canal <= WLO → opaco (logo)
const WHI = 245; // min de canal >= WHI → transparente (blanco)
const smooth = (t) => t * t * (3 - 2 * t);
const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(data.length);

for (let i = 0; i < data.length; i += channels) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const mn = Math.min(r, g, b);
  const t = (mn - WLO) / (WHI - WLO);
  const a = 1 - (t < 0 ? 0 : t > 1 ? 1 : smooth(t)); // blanco→0, logo→1
  // de-fringe: en bordes (a<1) resta el velo blanco proporcional a (1-a)
  const sub = (1 - a) * mn * 0.6;
  out[i] = clamp(r - sub);
  out[i + 1] = clamp(g - sub);
  out[i + 2] = clamp(b - sub);
  out[i + 3] = Math.round(a * 255);
}

const base = sharp(out, { raw: { width, height, channels } })
  .trim({ threshold: 10 }) // recorta el borde transparente
  .resize({ width: 820, withoutEnlargement: true });

await base.clone().png({ compressionLevel: 9 }).toFile(OUT);
await base
  .clone()
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(OUT.replace(/\.png$/, ".webp"));

const meta = await sharp(OUT).metadata();
console.log(
  `OK -> logo-histech.png/.webp (${meta.width}x${meta.height}, ratio ${(
    meta.width / meta.height
  ).toFixed(3)})`,
);
