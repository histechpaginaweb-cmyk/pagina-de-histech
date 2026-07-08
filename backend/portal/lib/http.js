// Utilidades HTTP comunes del portal: manejo uniforme de errores y respuestas.

// Envuelve un handler async para propagar errores al middleware de errores.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Error de negocio con código HTTP (lo captura errorHandler).
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Middleware final de errores del router del portal.
function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  // Error de validación Zod (lo lanzamos como HttpError normalmente, pero por si acaso).
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: "Datos inválidos", details: err.issues });
  }
  // Errores de subida de archivos (multer): tamaño/cantidad/tipo.
  if (err?.name === "MulterError") {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "La imagen supera el tamaño máximo permitido (5 MB)."
        : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
          ? "Solo se permiten hasta 2 imágenes."
          : "No se pudo procesar la imagen.";
    return res.status(400).json({ error: msg });
  }
  // Violación de restricción única de Prisma.
  if (err?.code === "P2002") {
    return res.status(409).json({
      error: "Ya existe un registro con ese valor único",
      details: err.meta?.target,
    });
  }
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "Registro no encontrado" });
  }
  console.error("[portal] Error no controlado:", err);
  return res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { asyncHandler, HttpError, errorHandler };
