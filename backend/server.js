// ─────────────────────────────────────────────────────────────
// Backend HISTECH — API de productos + panel admin.
// Persistencia: Cloudflare R2 (JSON de tarjetas + imágenes). Deploy: Render.
// SIN base de datos.
// ─────────────────────────────────────────────────────────────
require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const { readProducts, writeProducts, uploadImage, isConfigured } = require("./r2");
const {
  checkCredentials,
  issueCookie,
  clearCookie,
  requireAdmin,
} = require("./auth");

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

app.set("trust proxy", 1); // Render va detrás de proxy (cookies secure)
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN.split(","),
    credentials: true,
  }),
);

// Subida de imágenes en memoria → se reenvía a R2.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Solo se permiten imágenes")),
});

// Campos editables de una tarjeta.
const FIELDS = ["badge", "title", "excerpt", "image", "icon", "href", "position"];

function pick(body) {
  const out = {};
  for (const f of FIELDS) out[f] = body[f] ?? null;
  return out;
}

function sortByPosition(list) {
  return [...list].sort(
    (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0),
  );
}

// ── Salud / raíz ──
app.get("/", (_req, res) =>
  res.json({ ok: true, service: "histech-backend", admin: "/admin" }),
);

// ── API PÚBLICA: lista de productos (la consume el frontend) ──
app.get("/api/products", async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(sortByPosition(products));
  } catch (err) {
    console.error("GET /api/products", err);
    res.status(500).json({ error: "Error al leer productos" });
  }
});

// ── AUTH ──
app.post("/api/admin/login", (req, res) => {
  const { user, password } = req.body || {};
  if (!checkCredentials(user, password)) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
  issueCookie(res);
  res.json({ ok: true });
});

app.post("/api/admin/logout", (_req, res) => {
  clearCookie(res);
  res.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (_req, res) => res.json({ ok: true }));

// ── ADMIN: CRUD de productos (sobre el JSON en R2) ──
app.get("/api/admin/products", requireAdmin, async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(sortByPosition(products));
  } catch (err) {
    console.error("GET /api/admin/products", err);
    res.status(500).json({ error: "Error al leer productos" });
  }
});

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  const p = pick(req.body);
  if (!p.title) return res.status(400).json({ error: "El título es obligatorio" });
  try {
    const products = await readProducts();
    const maxPos = products.reduce(
      (m, x) => Math.max(m, Number(x.position) || 0),
      0,
    );
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      badge: p.badge,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      icon: p.icon,
      href: p.href,
      position: p.position != null ? Number(p.position) : maxPos + 1,
      created_at: now,
      updated_at: now,
    };
    products.push(item);
    await writeProducts(products);
    res.status(201).json(item);
  } catch (err) {
    console.error("POST /api/admin/products", err);
    res.status(500).json({ error: "No se pudo crear el producto" });
  }
});

app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  const p = pick(req.body);
  if (!p.title) return res.status(400).json({ error: "El título es obligatorio" });
  try {
    const products = await readProducts();
    const idx = products.findIndex((x) => String(x.id) === id);
    if (idx === -1) return res.status(404).json({ error: "No encontrado" });
    const prev = products[idx];
    const updated = {
      ...prev,
      badge: p.badge,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      icon: p.icon,
      href: p.href,
      position: p.position != null ? Number(p.position) : prev.position,
      updated_at: new Date().toISOString(),
    };
    products[idx] = updated;
    await writeProducts(products);
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/products/:id", err);
    res.status(500).json({ error: "No se pudo actualizar" });
  }
});

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id);
  try {
    const products = await readProducts();
    const next = products.filter((x) => String(x.id) !== id);
    await writeProducts(next);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/products/:id", err);
    res.status(500).json({ error: "No se pudo eliminar" });
  }
});

// ── ADMIN: subir imagen a R2 ──
app.post(
  "/api/admin/upload",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    if (!isConfigured()) {
      return res
        .status(500)
        .json({ error: "R2 no está configurado en el servidor" });
    }
    if (!req.file) return res.status(400).json({ error: "No se recibió imagen" });
    try {
      const url = await uploadImage(req.file.buffer, req.file.mimetype);
      res.json({ url });
    } catch (err) {
      console.error("POST /api/admin/upload", err);
      res.status(500).json({ error: "Error al subir la imagen" });
    }
  },
);

// Manejo de error de multer (tamaño/tipo)
app.use((err, _req, res, _next) => {
  if (err) return res.status(400).json({ error: err.message });
});

// ── Panel admin (estático, mismo origen que la API → sin líos de cookies) ──
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// Arranque
if (!isConfigured()) {
  console.warn(
    "[r2] Falta configurar R2 (R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET). " +
      "El carrusel mostrará los 6 productos seed, pero NO se podrán guardar cambios ni subir imágenes.",
  );
}
app.listen(PORT, () =>
  console.log(`[histech-backend] escuchando en :${PORT} — admin en /admin`),
);
