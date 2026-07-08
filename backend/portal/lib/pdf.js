// Generación del PDF de un ticket con la identidad visual de HISTECH.
// Usa pdfkit. Las imágenes adjuntas (WebP en R2) se descargan y convierten a
// JPEG con sharp para poder incrustarse (pdfkit no soporta WebP).
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const sharp = require("sharp");

// ── Paleta e identidad HISTECH ──
const PURPLE = "#7C3AED";
const PURPLE_DARK = "#4C1D95";
const LIGHT = "#F5F3FF";
const TEXT = "#111827";
const GRAY = "#6B7280";
const BORDER = "#E5E7EB";

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo-histech.png");

const COMPANY = {
  name: "HISTECH Tecnología",
  address: "Calle 116 # 70D-06 Ofi 301, Bogotá D.C., Colombia",
  email: "consultor@histech.com.co",
  phone: "+57 318 0008 152",
  site: "histech.com.co",
};

const STATUS_LABEL = {
  NUEVO: "Nuevo",
  ASIGNADO: "Asignado",
  EN_PROCESO: "En proceso",
  PENDIENTE_CLIENTE: "Pendiente del cliente",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
};
const PRIORITY_LABEL = { BAJA: "Baja", MEDIA: "Media", ALTA: "Alta", CRITICA: "Crítica" };
const CATEGORY_LABEL = {
  HARDWARE: "Hardware", SOFTWARE: "Software", RED: "Red", INTERNET: "Internet",
  IMPRESORAS: "Impresoras", OFFICE: "Office", CORREO: "Correo", ACCESOS: "Accesos", OTRO: "Otro",
};

function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-CO", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
function minutesToHuman(min) {
  if (min == null) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// Descarga una imagen (R2) y la devuelve como JPEG buffer para incrustar.
async function fetchAsJpeg(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return await sharp(buf).resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
  } catch {
    return null;
  }
}

// Construye el PDF y lo envía por el stream `res` de Express.
async function streamTicketPdf(ticket, res) {
  // Pre-descargar imágenes (antes de finalizar el documento).
  const clientImgs = ticket.attachments.filter((a) => a.kind === "CLIENT");
  const techImgs = ticket.attachments.filter((a) => a.kind === "TECH_EVIDENCE");
  const clientBuffers = (await Promise.all(clientImgs.map((a) => fetchAsJpeg(a.url)))).filter(Boolean);
  const techBuffers = (await Promise.all(techImgs.map((a) => fetchAsJpeg(a.url)))).filter(Boolean);

  const doc = new PDFDocument({ size: "A4", margin: 48, bufferPages: true });
  const pageW = doc.page.width;
  const contentW = pageW - 96; // margen 48 a cada lado
  const left = 48;

  doc.pipe(res);

  // ── Encabezado ──
  try {
    if (fs.existsSync(LOGO_PATH)) doc.image(LOGO_PATH, left, 40, { height: 30 });
  } catch { /* sin logo si falla */ }

  doc.fillColor(GRAY).font("Helvetica").fontSize(9).text("TICKET DE SOPORTE", left, 44, {
    width: contentW, align: "right",
  });
  doc.fillColor(PURPLE).font("Helvetica-Bold").fontSize(18).text(ticket.number, left, 56, {
    width: contentW, align: "right",
  });

  // Línea divisoria de marca
  doc.moveTo(left, 86).lineTo(pageW - 48, 86).lineWidth(2).strokeColor(PURPLE).stroke();
  doc.y = 100;

  // Asunto + estado
  doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(15).text(ticket.subject, left, doc.y, { width: contentW });
  doc.moveDown(0.3);
  doc.fillColor(GRAY).font("Helvetica").fontSize(10)
    .text(`Estado: ${STATUS_LABEL[ticket.status] || ticket.status}   ·   Prioridad: ${PRIORITY_LABEL[ticket.priority] || ticket.priority}   ·   Categoría: ${CATEGORY_LABEL[ticket.category] || ticket.category}`, { width: contentW });
  doc.moveDown(1);

  // ── Datos generales (dos columnas) ──
  sectionTitle(doc, left, contentW, "Información general");
  const rows = [
    ["Empresa", ticket.company?.name || "—"],
    ["Solicitante", ticket.createdBy?.fullName || "—"],
    ["Equipo", ticket.asset ? `${ticket.asset.internalCode} — ${ticket.asset.name}` : "—"],
    ["Área", ticket.area || "—"],
    ["Técnico responsable", ticket.assignedTo?.fullName || "Sin asignar"],
    ["Tiempo invertido", minutesToHuman(ticket.timeSpentMin)],
    ["Fecha de creación", fmtDateTime(ticket.createdAt)],
    ["Fecha de cierre", ticket.closedAt ? fmtDateTime(ticket.closedAt) : "—"],
  ];
  twoColRows(doc, left, contentW, rows);
  doc.moveDown(0.8);

  // ── Descripción ──
  sectionTitle(doc, left, contentW, "Descripción");
  paragraph(doc, left, contentW, ticket.description || "—");

  // ── Atención técnica ──
  if (ticket.diagnosis || ticket.actions || ticket.solution || ticket.recommendations) {
    sectionTitle(doc, left, contentW, "Atención técnica");
    if (ticket.diagnosis) labeledParagraph(doc, left, contentW, "Diagnóstico", ticket.diagnosis);
    if (ticket.actions) labeledParagraph(doc, left, contentW, "Acciones realizadas", ticket.actions);
    if (ticket.solution) labeledParagraph(doc, left, contentW, "Solución", ticket.solution);
    if (ticket.recommendations) labeledParagraph(doc, left, contentW, "Recomendaciones", ticket.recommendations);
  }

  // ── Cierre ──
  if (ticket.finalSolution) {
    sectionTitle(doc, left, contentW, "Cierre");
    labeledParagraph(doc, left, contentW, "Solución final", ticket.finalSolution);
    if (ticket.finalObservations) labeledParagraph(doc, left, contentW, "Observaciones finales", ticket.finalObservations);
  }

  // ── Imágenes ──
  if (clientBuffers.length || techBuffers.length) {
    sectionTitle(doc, left, contentW, "Imágenes adjuntas");
    imageRow(doc, left, contentW, "Del cliente", clientBuffers);
    imageRow(doc, left, contentW, "Evidencia técnica", techBuffers);
  }

  // ── Pie corporativo en todas las páginas ──
  drawFooters(doc, left, contentW);

  doc.end();
}

// ── Helpers de maquetación ──
function sectionTitle(doc, left, width, label) {
  ensureSpace(doc, 40);
  const y = doc.y;
  doc.rect(left, y, width, 22).fill(LIGHT);
  doc.fillColor(PURPLE_DARK).font("Helvetica-Bold").fontSize(10.5).text(label.toUpperCase(), left + 10, y + 6, { width: width - 20 });
  doc.fillColor(TEXT);
  doc.y = y + 30;
}

function twoColRows(doc, left, width, rows) {
  const colW = (width - 20) / 2;
  for (let i = 0; i < rows.length; i += 2) {
    ensureSpace(doc, 30);
    const y = doc.y;
    cell(doc, left, y, colW, rows[i][0], rows[i][1]);
    if (rows[i + 1]) cell(doc, left + colW + 20, y, colW, rows[i + 1][0], rows[i + 1][1]);
    doc.y = y + 34;
  }
}
function cell(doc, x, y, w, label, value) {
  doc.fillColor(GRAY).font("Helvetica").fontSize(8).text(label.toUpperCase(), x, y, { width: w });
  doc.fillColor(TEXT).font("Helvetica").fontSize(10.5).text(String(value), x, y + 12, { width: w });
}

function paragraph(doc, left, width, text) {
  ensureSpace(doc, 40);
  doc.fillColor(TEXT).font("Helvetica").fontSize(10.5).text(text, left, doc.y, { width, align: "left" });
  doc.moveDown(0.8);
}
function labeledParagraph(doc, left, width, label, text) {
  ensureSpace(doc, 44);
  doc.fillColor(PURPLE).font("Helvetica-Bold").fontSize(9.5).text(label, left, doc.y, { width });
  doc.fillColor(TEXT).font("Helvetica").fontSize(10.5).text(text, left, doc.y + 2, { width });
  doc.moveDown(0.6);
}

function imageRow(doc, left, width, label, buffers) {
  if (!buffers.length) return;
  ensureSpace(doc, 130);
  doc.fillColor(GRAY).font("Helvetica").fontSize(9).text(label, left, doc.y, { width });
  const y = doc.y + 4;
  const imgW = 150, gap = 16;
  buffers.slice(0, 2).forEach((buf, i) => {
    try { doc.image(buf, left + i * (imgW + gap), y, { fit: [imgW, 110] }); } catch { /* omitir */ }
  });
  doc.y = y + 120;
}

// Reserva espacio; si no cabe, salta de página.
function ensureSpace(doc, needed) {
  const bottom = doc.page.height - 70;
  if (doc.y + needed > bottom) doc.addPage();
}

// Pie corporativo en cada página.
function drawFooters(doc, left, width) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // El pie se dibuja dentro del margen inferior. pdfkit pagina automáticamente
    // cuando el texto supera `alto - margen.inferior`; al anular ese margen en la
    // página, considera que hay espacio hasta el borde y NO añade páginas en blanco.
    doc.page.margins.bottom = 0;
    const y = doc.page.height - 56;
    doc.moveTo(left, y).lineTo(doc.page.width - 48, y).lineWidth(1).strokeColor(BORDER).stroke();
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
      .text(`${COMPANY.name}  ·  ${COMPANY.address}`, left, y + 8, { width, align: "center", lineBreak: false });
    doc.text(`${COMPANY.email}  ·  ${COMPANY.phone}  ·  ${COMPANY.site}`, left, y + 20, { width, align: "center", lineBreak: false });
  }
}

module.exports = { streamTicketPdf };
