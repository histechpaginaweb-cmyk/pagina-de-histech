// Utilidades de tickets: numeración anual atómica, registro de eventos
// (línea de tiempo) y forma de inclusión estándar para las respuestas.
const { prisma } = require("./prisma");

// Genera el siguiente número de ticket del año en curso de forma atómica.
// Usa un UPSERT SQL sobre `counters` para evitar condiciones de carrera.
// Formato: HT-AAAA-###### (6 dígitos).
async function nextTicketNumber(tx = prisma) {
  const year = new Date().getFullYear();
  const key = `ticket:${year}`;
  const rows = await tx.$queryRaw`
    INSERT INTO counters (key, value) VALUES (${key}, 1)
    ON CONFLICT (key) DO UPDATE SET value = counters.value + 1
    RETURNING value`;
  const seq = Number(rows[0].value);
  return `HT-${year}-${String(seq).padStart(6, "0")}`;
}

// Registra un evento en la línea de tiempo del ticket.
async function logEvent(tx, { ticketId, userId, action, note, fromStatus, toStatus }) {
  return tx.ticketEvent.create({
    data: {
      ticketId,
      userId,
      action,
      note: note ?? null,
      fromStatus: fromStatus ?? null,
      toStatus: toStatus ?? null,
    },
  });
}

// Inclusión estándar para devolver un ticket "completo".
const ticketInclude = {
  company: { select: { id: true, name: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  assignedTo: { select: { id: true, fullName: true } },
  closedBy: { select: { id: true, fullName: true } },
  asset: { select: { id: true, name: true, internalCode: true } },
  attachments: { orderBy: { createdAt: "asc" } },
  events: {
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, fullName: true, role: true } } },
  },
};

// Inclusión ligera para listados (sin eventos ni adjuntos).
const ticketListInclude = {
  company: { select: { id: true, name: true } },
  createdBy: { select: { id: true, fullName: true } },
  assignedTo: { select: { id: true, fullName: true } },
  asset: { select: { id: true, name: true, internalCode: true } },
};

module.exports = { nextTicketNumber, logEvent, ticketInclude, ticketListInclude };
