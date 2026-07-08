// Sesión del Portal — JWT en cookie httpOnly. Independiente de la sesión del
// panel /admin del backend (otro nombre de cookie y otro secreto).
const jwt = require("jsonwebtoken");

const COOKIE = "histech_portal";
const SECRET =
  process.env.PORTAL_JWT_SECRET ||
  process.env.JWT_SECRET ||
  "dev-portal-insecure-secret-change-me";
const isProd = process.env.NODE_ENV === "production";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 horas

// El payload lleva lo mínimo para autorizar sin ir a la BD en cada request:
// identidad, rol y empresa (para el aislamiento multi-tenant).
function signSession(payload) {
  return jwt.sign(
    { userId: payload.userId, role: payload.role, companyId: payload.companyId },
    SECRET,
    { expiresIn: "8h" },
  );
}

function verifySession(token) {
  return jwt.verify(token, SECRET);
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
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
