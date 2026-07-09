// Sesión del Portal — JWT en cookie httpOnly. Independiente de la sesión del
// panel /admin del backend (otro nombre de cookie y otro secreto).
const jwt = require("jsonwebtoken");

const COOKIE = "histech_portal";
const isProd = process.env.NODE_ENV === "production";

// En producción el secreto es OBLIGATORIO: si falta, se detiene el arranque en
// vez de usar un secreto por defecto (que permitiría falsificar sesiones).
const SECRET = process.env.PORTAL_JWT_SECRET || process.env.JWT_SECRET;
if (isProd && !SECRET) {
  throw new Error(
    "[portal] Falta PORTAL_JWT_SECRET (o JWT_SECRET) en producción. Configúralo antes de arrancar.",
  );
}
const EFFECTIVE_SECRET = SECRET || "dev-portal-insecure-secret-change-me";

const TOKEN_TTL = "2h";
const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 horas

// El payload lleva lo mínimo para autorizar sin ir a la BD en cada request:
// identidad, rol y empresa (para el aislamiento multi-tenant).
function signSession(payload) {
  return jwt.sign(
    { userId: payload.userId, role: payload.role, companyId: payload.companyId },
    EFFECTIVE_SECRET,
    { expiresIn: TOKEN_TTL },
  );
}

function verifySession(token) {
  return jwt.verify(token, EFFECTIVE_SECRET);
}

// sameSite "lax": el sitio consume el API por un rewrite MISMO-ORIGEN, así que
// no se necesita "none". "lax" reduce la superficie de CSRF. httpOnly + secure.
function setSessionCookie(res, token) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}

module.exports = {
  COOKIE,
  signSession,
  verifySession,
  setSessionCookie,
  clearSessionCookie,
};
