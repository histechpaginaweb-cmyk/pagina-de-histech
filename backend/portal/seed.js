// ─────────────────────────────────────────────────────────────────────────────
// Seed inicial del Portal: crea (si no existe) la empresa interna HISTECH y el
// primer Administrador HISTECH. Idempotente: se puede ejecutar varias veces.
//
// Uso:  npm run portal:seed
// Requiere en el entorno:
//   PORTAL_DATABASE_URL           conexión a la BD dedicada (Neon)
//   PORTAL_ADMIN_EMAIL            correo del primer admin
//   PORTAL_ADMIN_USERNAME         usuario del primer admin (opcional, def. "admin")
//   PORTAL_ADMIN_PASSWORD         contraseña del primer admin (mín. 8)
//   PORTAL_ADMIN_NAME             nombre completo (opcional)
// ─────────────────────────────────────────────────────────────────────────────
require("dotenv").config();
const { prisma } = require("./lib/prisma");
const { hashPassword } = require("./lib/password");

async function main() {
  const email = (process.env.PORTAL_ADMIN_EMAIL || "").trim().toLowerCase();
  const username = (process.env.PORTAL_ADMIN_USERNAME || "admin").trim();
  const password = process.env.PORTAL_ADMIN_PASSWORD || "";
  const fullName = process.env.PORTAL_ADMIN_NAME || "Administrador HISTECH";

  if (!email || !password) {
    throw new Error(
      "Faltan PORTAL_ADMIN_EMAIL y/o PORTAL_ADMIN_PASSWORD en el entorno.",
    );
  }
  if (password.length < 8) {
    throw new Error("PORTAL_ADMIN_PASSWORD debe tener al menos 8 caracteres.");
  }

  // Empresa interna que agrupa al personal de HISTECH.
  const company = await prisma.company.upsert({
    where: { id: "histech-internal" },
    update: {},
    create: {
      id: "histech-internal",
      name: "HISTECH (Interno)",
      status: "ACTIVE",
      internalNotes: "Empresa interna que agrupa al personal administrador de HISTECH.",
    },
  });

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    console.log(
      `[seed] El usuario admin ya existe (${existing.email}). No se crea de nuevo.`,
    );
    return;
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.user.create({
    data: {
      companyId: company.id,
      fullName,
      username,
      email,
      passwordHash,
      role: "ADMIN_HISTECH",
      status: "ACTIVE",
    },
  });

  console.log(`[seed] Administrador HISTECH creado: ${admin.email} (usuario: ${admin.username})`);
}

main()
  .catch((err) => {
    console.error("[seed] Error:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
