// Middlewares de seguridad del Portal: sesión, roles y aislamiento por empresa.
const { COOKIE, verifySession } = require("../lib/jwt");
const { HttpError } = require("../lib/http");

// Exige una sesión válida. Rellena req.auth = { userId, role, companyId }.
function requireAuth(req, _res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return next(new HttpError(401, "No autenticado"));
  try {
    req.auth = verifySession(token);
    return next();
  } catch {
    return next(new HttpError(401, "Sesión inválida o expirada"));
  }
}

// Exige uno de los roles indicados. Usar SIEMPRE después de requireAuth.
function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.auth) return next(new HttpError(401, "No autenticado"));
    if (!roles.includes(req.auth.role)) {
      return next(new HttpError(403, "No tienes permisos para esta operación"));
    }
    return next();
  };
}

// Atajo: solo Administrador HISTECH.
const requireAdmin = requireRole("ADMIN_HISTECH");

// Devuelve el filtro de empresa según el rol:
//  - ADMIN_HISTECH → {} (ve todo) o filtra por ?companyId si se envía.
//  - CLIENT        → forzado a su propia empresa (aislamiento multi-tenant).
// Se usa dentro de los controladores para construir el `where` de Prisma.
function companyScope(req) {
  if (req.auth.role === "ADMIN_HISTECH") {
    const requested = req.query?.companyId;
    return requested ? { companyId: String(requested) } : {};
  }
  return { companyId: req.auth.companyId };
}

// Verifica que un CLIENT solo acceda a recursos de su propia empresa.
function assertCompanyAccess(req, companyId) {
  if (req.auth.role === "ADMIN_HISTECH") return;
  if (req.auth.companyId !== companyId) {
    throw new HttpError(403, "No tienes acceso a los datos de esta empresa");
  }
}

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin,
  companyScope,
  assertCompanyAccess,
};
