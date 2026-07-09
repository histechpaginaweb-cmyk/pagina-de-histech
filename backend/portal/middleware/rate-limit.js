// Rate limiting del Portal (protección contra fuerza bruta y abuso).
// Nota: complementa al bloqueo de cuenta por-usuario (en el login). El límite por
// IP frena ataques directos al backend; el bloqueo de cuenta cubre ataques
// distribuidos o a través del proxy del sitio.
const rateLimit = require("express-rate-limit");

// Login: límite por (IP + usuario). Se clavea por usuario además de la IP porque
// el sitio llega al backend a través de un proxy (Vercel) y varios usuarios
// legítimos pueden compartir IP; así no se bloquean entre ellos. La defensa
// principal e independiente de la IP es el BLOQUEO DE CUENTA (en el login).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // 10 intentos por (IP, usuario)
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${req.ip}|${(req.body?.identifier || "").toString().toLowerCase().trim()}`,
  // Desactiva solo las advertencias de validación (keyGenerator personalizado).
  validate: false,
  message: {
    error:
      "Demasiados intentos de inicio de sesión. Espera unos minutos e inténtalo de nuevo.",
  },
});

module.exports = { loginLimiter };
