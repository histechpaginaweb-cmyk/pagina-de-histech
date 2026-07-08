// Rutas de autenticación del Portal.
const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const { verifyPassword } = require("../lib/password");
const { signSession, setSessionCookie, clearSessionCookie } = require("../lib/jwt");
const { asyncHandler, HttpError } = require("../lib/http");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../validators/schemas");
const { publicUser } = require("../lib/serialize");

const router = Router();

// POST /auth/login — acepta username o email en `identifier`.
router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.valid.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier.toLowerCase() }],
      },
      include: { company: { select: { id: true, name: true, status: true } } },
    });

    // Mensaje genérico para no revelar si el usuario existe.
    const invalid = () => new HttpError(401, "Usuario o contraseña incorrectos");
    if (!user) throw invalid();

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw invalid();

    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "Tu cuenta está desactivada. Contacta a HISTECH.");
    }
    // Un cliente de una empresa desactivada no puede entrar.
    if (user.role === "CLIENT" && user.company?.status !== "ACTIVE") {
      throw new HttpError(403, "La empresa está desactivada. Contacta a HISTECH.");
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
