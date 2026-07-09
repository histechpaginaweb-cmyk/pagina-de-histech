// Rutas de autenticación del Portal.
const bcrypt = require("bcryptjs");
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { verifyPassword } = require("../lib/password");
const { signSession, setSessionCookie, clearSessionCookie } = require("../lib/jwt");
const { asyncHandler, HttpError } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../validators/schemas");
const { publicUser } = require("../lib/serialize");
const { loginLimiter } = require("../middleware/rate-limit");

const router = Router();

// Política de bloqueo por fuerza bruta.
const MAX_FAILED = 8; // fallos antes de bloquear
const LOCK_MINUTES = 15; // duración del bloqueo

// Hash ficticio: cuando el usuario NO existe, igualamos el tiempo de respuesta
// (bcrypt) para no filtrar por temporización qué usuarios son válidos.
const DUMMY_HASH = bcrypt.hashSync("timing-guard-not-a-real-password", 12);

// POST /auth/login — acepta username o email en `identifier`.
router.post(
  "/login",
  loginLimiter,
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.valid.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier.toLowerCase() }],
      },
      include: { company: { select: { id: true, name: true, status: true } } },
    });

    const invalid = () => new HttpError(401, "Usuario o contraseña incorrectos");

    // Usuario inexistente: gastamos el mismo tiempo (anti-enumeración) y salimos.
    if (!user) {
      await verifyPassword(password, DUMMY_HASH);
      throw invalid();
    }

    // ¿Cuenta bloqueada temporalmente por intentos fallidos?
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new HttpError(
        429,
        "Cuenta bloqueada temporalmente por varios intentos fallidos. Intenta de nuevo en unos minutos.",
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);

    if (!ok) {
      // Registra el fallo y bloquea al alcanzar el umbral.
      const nextCount = user.failedLoginCount + 1;
      const reachedLimit = nextCount >= MAX_FAILED;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: reachedLimit ? 0 : nextCount,
          lockedUntil: reachedLimit
            ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
            : user.lockedUntil,
        },
      });
      throw invalid();
    }

    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "Tu cuenta está desactivada. Contacta a HISTECH.");
    }
    // Un cliente de una empresa desactivada no puede entrar.
    if (user.role === "CLIENT" && user.company?.status !== "ACTIVE") {
      throw new HttpError(403, "La empresa está desactivada. Contacta a HISTECH.");
    }

    // Éxito: limpia contador/bloqueo si hacía falta.
    if (user.failedLoginCount > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: 0, lockedUntil: null },
      });
    }

    const token = signSession({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });
    setSessionCookie(res, token);

    res.json({ user: publicUser(user) });
  }),
);

// POST /auth/logout
router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

// GET /auth/me — datos de la sesión actual.
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      include: { company: { select: { id: true, name: true, status: true } } },
    });
    if (!user) throw new HttpError(401, "Sesión inválida");
    res.json({ user: publicUser(user) });
  }),
);

module.exports = router;
