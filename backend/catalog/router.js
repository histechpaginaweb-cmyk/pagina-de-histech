// HTTP layer of the catalog. `server.js` only mounts this router:
//   app.use("/api", createCatalogRouter({ service, requireAdmin, uploader }))
//
//   Public (published products only)   /api/catalog/...
//   Admin (behind requireAdmin)        /api/admin/catalog/...
//
// The service, the admin middleware and the uploader are injected so tests run
// with the in-memory repository, a fake admin check and a fake uploader.
const express = require("express");
const multer = require("multer");
const { CatalogError } = require("./errors");
const {
  IMAGE_TYPES,
  DOCUMENT_TYPES,
  MAX_IMAGE_BYTES,
  MAX_DATASHEET_BYTES,
  sniffFileType,
} = require("./uploads");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const invalidUpload = (message) =>
  new CatalogError("VALIDATION", message, [{ path: "file", message }]);

function multerErrorMessage(err) {
  if (err.code === "LIMIT_FILE_SIZE") return "El archivo supera el tamaño máximo permitido";
  if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
    return "Campo de archivo no válido";
  }
  return "No se pudo procesar el archivo";
}

// Error handling scoped to the sub-routers below, so errors raised by other
// parts of the app never pass through here.
function errorHandler(err, _req, res, next) {
  if (err instanceof CatalogError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: multerErrorMessage(err) });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido" });
  }
  if (res.headersSent) return next(err);
  console.error("[catalog] Error no controlado:", err);
  return res.status(500).json({ error: "Error interno del servidor" });
}

/** Builds a multer middleware + handler pair for one kind of upload. */
function uploadRoute({ field, maxBytes, allowedTypes, store }) {
  const parser = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1 },
    fileFilter: (_req, file, cb) =>
      allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(invalidUpload("Tipo de archivo no permitido")),
  }).single(field);

  return [
    parser,
    asyncHandler(async (req, res) => {
      if (!req.file) throw invalidUpload("No se recibió ningún archivo");
      const detected = sniffFileType(req.file.buffer);
      if (!detected || detected !== req.file.mimetype || !allowedTypes.includes(detected)) {
        throw invalidUpload("El contenido del archivo no coincide con un tipo permitido");
      }
      res.json({ url: await store(req.file.buffer, detected) });
    }),
  ];
}

function createCatalogRouter({ service, requireAdmin, uploader }) {
  // ── Public ──
  const pub = express.Router();

  pub.get("/products", asyncHandler(async (req, res) => res.json(await service.listPublicProducts(req.query))));
  pub.get("/products/:slug", asyncHandler(async (req, res) => res.json(await service.getPublicProduct(req.params.slug))));
  pub.get("/categories", asyncHandler(async (_req, res) => res.json(await service.listPublicCategories())));
  pub.get("/brands", asyncHandler(async (_req, res) => res.json(await service.listPublicBrands())));
  pub.get("/settings", asyncHandler(async (_req, res) => res.json(await service.getPublicSettings())));
  pub.use(errorHandler);

  // ── Admin ──
  const admin = express.Router();
  admin.use(requireAdmin);
  admin.use(express.json());

  const requireStorage = (_req, res, next) =>
    uploader.isConfigured()
      ? next()
      : res.status(500).json({ error: "R2 no está configurado en el servidor" });

  admin.post(
    "/upload/image",
    requireStorage,
    ...uploadRoute({
      field: "image",
      maxBytes: MAX_IMAGE_BYTES,
      allowedTypes: IMAGE_TYPES,
      store: (buffer, mimetype) => uploader.uploadImage(buffer, mimetype),
    }),
  );
  admin.post(
    "/upload/datasheet",
    requireStorage,
    ...uploadRoute({
      field: "datasheet",
      maxBytes: MAX_DATASHEET_BYTES,
      allowedTypes: DOCUMENT_TYPES,
      store: (buffer, mimetype) => uploader.uploadDocument(buffer, mimetype),
    }),
  );

  admin.get("/products", asyncHandler(async (req, res) => res.json(await service.listAdminProducts(req.query))));
  admin.get("/products/:id", asyncHandler(async (req, res) => res.json(await service.getAdminProduct(req.params.id))));
  admin.post("/products", asyncHandler(async (req, res) => res.status(201).json(await service.createProduct(req.body))));
  admin.put("/products/:id", asyncHandler(async (req, res) => res.json(await service.updateProduct(req.params.id, req.body))));
  admin.patch("/products/:id", asyncHandler(async (req, res) => res.json(await service.patchProduct(req.params.id, req.body))));
  admin.delete(
    "/products/:id",
    asyncHandler(async (req, res) => {
      await service.deleteProduct(req.params.id);
      res.json({ ok: true });
    }),
  );

  admin.get("/categories", asyncHandler(async (_req, res) => res.json(await service.listAdminCategories())));
  admin.post("/categories", asyncHandler(async (req, res) => res.status(201).json(await service.createCategory(req.body))));
  admin.put("/categories/:id", asyncHandler(async (req, res) => res.json(await service.updateCategory(req.params.id, req.body))));
  admin.delete(
    "/categories/:id",
    asyncHandler(async (req, res) => {
      await service.deleteCategory(req.params.id);
      res.json({ ok: true });
    }),
  );

  admin.get("/brands", asyncHandler(async (_req, res) => res.json(await service.listAdminBrands())));
  admin.post("/brands", asyncHandler(async (req, res) => res.status(201).json(await service.createBrand(req.body))));
  admin.put("/brands/:id", asyncHandler(async (req, res) => res.json(await service.updateBrand(req.params.id, req.body))));
  admin.delete(
    "/brands/:id",
    asyncHandler(async (req, res) => {
      await service.deleteBrand(req.params.id);
      res.json({ ok: true });
    }),
  );

  admin.get("/settings", asyncHandler(async (_req, res) => res.json(await service.getSettings())));
  admin.put("/settings", asyncHandler(async (req, res) => res.json(await service.updateSettings(req.body))));
  admin.use(errorHandler);

  const router = express.Router();
  router.use("/catalog", pub);
  router.use("/admin/catalog", admin);
  return router;
}

module.exports = { createCatalogRouter };
