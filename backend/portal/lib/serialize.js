// Serializadores: nunca exponer el hash de contraseña ni datos sensibles al cliente.

function publicUser(u) {
  if (!u) return null;
  // No exponer el hash ni los contadores internos de seguridad.
  const { passwordHash, failedLoginCount, lockedUntil, ...safe } = u;
  return safe;
}

module.exports = { publicUser };
