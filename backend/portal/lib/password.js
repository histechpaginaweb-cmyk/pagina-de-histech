// Hash y verificación de contraseñas con bcryptjs (implementación pura en JS:
// evita compilaciones nativas problemáticas en Render/Windows).
const bcrypt = require("bcryptjs");

const ROUNDS = 12;

async function hashPassword(plain) {
  return bcrypt.hash(String(plain), ROUNDS);
}

async function verifyPassword(plain, hash) {
  if (!hash) return false;
  return bcrypt.compare(String(plain), hash);
}

module.exports = { hashPassword, verifyPassword };
