// Notificaciones por correo del Portal (Resend). Solo email (sin WhatsApp).
// Si no hay RESEND_API_KEY configurada, se registra en consola y se omite el
// envío (no rompe la operación). Nunca lanza: las notificaciones no deben tumbar
// la petición principal.
const { prisma } = require("./prisma");

const FROM = process.env.PORTAL_MAIL_FROM || "HISTECH Soporte <onboarding@resend.dev>";
const ADMIN_NOTIFY = process.env.PORTAL_NOTIFY_EMAIL || "consultor@histech.com.co";
const PUBLIC_URL = (process.env.PORTAL_PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");

const STATUS_LABEL = {
  NUEVO: "Nuevo", ASIGNADO: "Asignado", EN_PROCESO: "En proceso",
  PENDIENTE_CLIENTE: "Pendiente del cliente", RESUELTO: "Resuelto", CERRADO: "Cerrado",
};
const PRIORITY_LABEL = { BAJA: "Baja", MEDIA: "Media", ALTA: "Alta", CRITICA: "Crítica" };

let resendClient = null;
function getResend() {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const { Resend } = require("resend");
  resendClient = new Resend(key);
  return resendClient;
}

// Envío base. Acepta uno o varios destinatarios; ignora vacíos.
async function send({ to, subject, html }) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) return;
  const resend = getResend();
  if (!resend) {
    console.info(`[portal/mail] Resend no configurado. Omitido: "${subject}" → ${recipients.join(", ")}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to: recipients, subject, html });
  } catch (err) {
    console.error("[portal/mail] Error al enviar:", err?.message || err);
  }
}

// Plantilla HTML con identidad de marca (púrpura HISTECH).
function template({ heading, ticket, ctaLabel, ctaUrl, intro }) {
  const rows = [
    ["Ticket", ticket.number],
    ["Asunto", ticket.subject],
    ["Empresa", ticket.company?.name || "—"],
    ["Estado", STATUS_LABEL[ticket.status] || ticket.status],
    ["Prioridad", PRIORITY_LABEL[ticket.priority] || ticket.priority],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#6B7280;font-size:13px;width:120px">${k}</td><td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#F5F3FF;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:linear-gradient(135deg,#7C3AED,#A855F7);border-radius:16px 16px 0 0;padding:22px 28px">
      <div style="color:#fff;font-size:18px;font-weight:800;letter-spacing:.5px">HISTECH</div>
      <div style="color:#EDE9FE;font-size:12px">Portal de Soporte Empresarial</div>
    </div>
    <div style="background:#fff;border:1px solid #E5E7EB;border-top:0;border-radius:0 0 16px 16px;padding:28px">
      <h1 style="margin:0 0 6px;font-size:18px;color:#111827">${escapeHtml(heading)}</h1>
      ${intro ? `<p style="margin:0 0 16px;color:#4B5563;font-size:14px;line-height:1.5">${escapeHtml(intro)}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin:8px 0 20px">${rows}</table>
      <a href="${ctaUrl}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px">${escapeHtml(ctaLabel)}</a>
      <p style="margin:22px 0 0;color:#9CA3AF;font-size:11px">Este es un mensaje automático del Portal de Soporte de HISTECH. Por favor no respondas a este correo.</p>
    </div>
  </div></body></html>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const clientUrl = (id) => `${PUBLIC_URL}/portal/tickets/${id}`;
const adminUrl = (id) => `${PUBLIC_URL}/portal/admin/tickets/${id}`;

// ── Eventos ──

// Nuevo ticket → notifica a HISTECH (admin).
async function notifyNewTicket(ticket) {
  await send({
    to: ADMIN_NOTIFY,
    subject: `Nuevo ticket ${ticket.number} — ${ticket.company?.name || ""}`.trim(),
    html: template({
      heading: "Se ha creado un nuevo ticket",
      intro: `${ticket.createdBy?.fullName || "Un usuario"} registró una nueva solicitud de soporte.`,
      ticket,
      ctaLabel: "Ver ticket",
      ctaUrl: adminUrl(ticket.id),
    }),
  });
}

// Ticket asignado → notifica al técnico y al solicitante.
async function notifyAssigned(ticket) {
  const tech = ticket.assignedToId
    ? await prisma.user.findUnique({ where: { id: ticket.assignedToId }, select: { email: true, fullName: true } })
    : null;
  await send({
    to: tech?.email,
    subject: `Ticket ${ticket.number} asignado a ti`,
    html: template({
      heading: "Se te ha asignado un ticket",
      intro: "Tienes un nuevo ticket asignado para atender.",
      ticket,
      ctaLabel: "Atender ticket",
      ctaUrl: adminUrl(ticket.id),
    }),
  });
  await send({
    to: ticket.createdBy?.email,
    subject: `Tu ticket ${ticket.number} fue asignado`,
    html: template({
      heading: "Tu ticket ya tiene técnico asignado",
      intro: "Un técnico de HISTECH comenzará a atender tu solicitud.",
      ticket,
      ctaLabel: "Ver estado",
      ctaUrl: clientUrl(ticket.id),
    }),
  });
}

// Ticket actualizado → notifica al solicitante.
async function notifyUpdated(ticket) {
  await send({
    to: ticket.createdBy?.email,
    subject: `Actualización de tu ticket ${ticket.number}`,
    html: template({
      heading: "Tu ticket ha sido actualizado",
      intro: `El estado actual es: ${STATUS_LABEL[ticket.status] || ticket.status}.`,
      ticket,
      ctaLabel: "Ver ticket",
      ctaUrl: clientUrl(ticket.id),
    }),
  });
}

// Ticket cerrado → notifica al solicitante.
async function notifyClosed(ticket) {
  await send({
    to: ticket.createdBy?.email,
    subject: `Tu ticket ${ticket.number} fue resuelto y cerrado`,
    html: template({
      heading: "Tu ticket ha sido cerrado",
      intro: "Tu solicitud fue resuelta. Puedes consultar el detalle y descargar el PDF.",
      ticket,
      ctaLabel: "Ver resumen",
      ctaUrl: clientUrl(ticket.id),
    }),
  });
}

module.exports = { notifyNewTicket, notifyAssigned, notifyUpdated, notifyClosed };
