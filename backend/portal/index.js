// ─────────────────────────────────────────────────────────────────────────────
// Portal de Soporte Empresarial HISTECH — Router raíz (módulo aislado).
//
// Se monta en el backend existente bajo /api/portal SIN tocar las rutas de
// productos/blog. Toda la lógica de negocio, auth, datos y (fases siguientes)
// tickets/reportes/PDF vive aquí. BD dedicada vía PORTAL_DATABASE_URL.
// ─────────────────────────────────────────────────────────────────────────────
const { Router } = require("express");
const helmet = require("helmet");
const { errorHandler } = require("./lib/http");

const authRoutes = require("./routes/auth.routes");
const companiesRoutes = require("./routes/companies.routes");
const usersRoutes = require("./routes/users.routes");
const assetsRoutes = require("./routes/assets.routes");
const ticketsRoutes = require("./routes/tickets.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const reportsRoutes = require("./routes/reports.routes");

const portal = Router();

// Cabeceras de seguridad (helmet) — solo para /api/portal, sin afectar las rutas
// existentes de productos/blog ni el panel /admin.
portal.use(helmet());

// Salud del módulo (útil para monitoreo independiente).
portal.get("/health", (_req, res) =>
  res.json({ ok: true, module: "portal-soporte", ts: new Date().toISOString() }),
);

portal.use("/auth", authRoutes);
portal.use("/companies", companiesRoutes);
portal.use("/", usersRoutes); // /users y /companies/:companyId/users
portal.use("/", assetsRoutes); // /assets y /companies/:companyId/assets
portal.use("/", ticketsRoutes); // /tickets y subrutas
portal.use("/", dashboardRoutes); // /dashboard/admin
portal.use("/", reportsRoutes); // /reports/tickets.xlsx

// Manejo de errores propio del portal (no interfiere con el resto del backend).
portal.use(errorHandler);

module.exports = portal;
