// Procesa los assets del Hero LIGHT (rediseño premium claro):
//   Fondo_blanco.jpg     → public/hero-bg-light.webp  (fondo claro full-bleed)
//   fondo_6_obejtos.jpg  → public/hero-objects.webp   (ilustración del ecosistema)
//
// La ilustración conserva su fondo BLANCO a propósito: en el Hero se renderiza
// con `mix-blend-mode: multiply`, de modo que el blanco se funde con el fondo
// claro y solo quedan los objetos 3D + sus labels (sin recortar nada).
// Uso: node scripts/process-hero-light.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const pub = (f) => path.join(root, "public", f);
const src = (f) => path.join(root, "assets-fuente", f);

// 1 — Fondo claro full-bleed (no se agranda; sólo se optimiza a webp)
const bg = await sharp(src("Fondo_blanco.jpg")).metadata();
await sharp(src("Fondo_blanco.jpg"))
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 86 })
  .toFile(pub("hero-bg-light.webp"));
console.log(`OK -> hero-bg-light.webp (src ${bg.width}x${bg.height})`);

// 2 — Ilustración del ecosistema (fondo blanco intacto para multiply)
const obj = await sharp(src("fondo_6_obejtos.jpg")).metadata();
await sharp(src("fondo_6_obejtos.jpg"))
  .webp({ quality: 94 })
  .toFile(pub("hero-objects.webp"));
console.log(`OK -> hero-objects.webp (src ${obj.width}x${obj.height})`);
