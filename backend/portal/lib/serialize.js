// Serializadores: nunca exponer el hash de contraseña ni datos sensibles al cliente.

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}

module.exports = { publicUser };
