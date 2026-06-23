// Autenticación simple de un único administrador.
// Login compara contra ADMIN_USER/ADMIN_PASSWORD y emite un JWT en cookie httpOnly.
const jwt = require("jsonwebtoken");

const COOKIE = "histech_admin";
const SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
const isProd = process.env.NODE_ENV === "production";

function checkCredentials(user, password) {
  return (
    user === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD &&
    Boolean(process.env.ADMIN_USER)
  );
}

function issueCookie(res) {
  const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "8h" });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd, // en Render (https) va seguro; en local http no
    sameSite: isProd ? "none" : "lax",
    maxAge: 8 * 60 * 60 * 1000,
  });
}

function clearCookie(res) {
  res.clearCookie(COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}

// Middleware que exige sesión válida de admin.
function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}

module.exports = { checkCredentials, issueCookie, clearCookie, requireAdmin };
