import type { ContactInput } from "./contact-schema";

/** Product the visitor is asking about, sent as hidden fields by the quote form. */
export type ProductContext = { name: string; reference: string; url: string };

const MAX_NAME = 160;
const MAX_REFERENCE = 120;
const MAX_URL = 500;

/** Single line, trimmed, capped: hidden fields are client-controlled, so never trust their shape. */
const oneLine = (value: FormDataEntryValue | null, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Reads the optional product context. `null` for the regular contact form. */
export function parseProductContext(formData: FormData): ProductContext | null {
  const name = oneLine(formData.get("productName"), MAX_NAME);
  if (!name) return null;
  const url = oneLine(formData.get("productUrl"), MAX_URL);
  return {
    name,
    reference: oneLine(formData.get("productReference"), MAX_REFERENCE),
    url: /^https?:\/\//i.test(url) ? url : "",
  };
}

/** Subject and plain-text body of the lead email. Unchanged when there is no product. */
export function buildContactEmail(
  data: ContactInput,
  product?: ProductContext | null,
): { subject: string; text: string } {
  const fullName = `${data.firstName} ${data.lastName}`;
  const lines = [
    `Nombre: ${fullName}`,
    `Empresa: ${data.company}`,
    `Correo: ${data.email}`,
    `Celular: ${data.phone}`,
    `Servicio: ${data.service}`,
  ];

  if (product) {
    lines.push("", `Producto: ${product.name}`);
    if (product.reference) lines.push(`Referencia: ${product.reference}`);
    if (product.url) lines.push(`Enlace: ${product.url}`);
  }

  lines.push("", "Mensaje:", data.message);

  return {
    subject: product
      ? `Solicitud de cotización — ${product.name} — ${fullName}`
      : `Nuevo contacto — ${fullName} (${data.service})`,
    text: lines.join("\n"),
  };
}
