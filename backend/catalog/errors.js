// Domain errors for the catalog. The router maps `code` to an HTTP status.
// Messages are user-visible in the admin panel, so they are in Spanish.

const STATUS_BY_CODE = {
  VALIDATION: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  IN_USE: 409,
};

class CatalogError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "CatalogError";
    this.code = code;
    this.details = details;
  }

  get status() {
    return STATUS_BY_CODE[this.code] ?? 500;
  }
}

const notFound = (what = "Registro") => new CatalogError("NOT_FOUND", `${what} no encontrado`);
const conflict = (message, details) => new CatalogError("CONFLICT", message, details);
const inUse = (message) => new CatalogError("IN_USE", message);

module.exports = { CatalogError, notFound, conflict, inUse };
