import { getPriceDisplay } from "./price";
import type { PublicProduct } from "./types";

/** Reference shown to advisors: the SKU when there is one, otherwise the model. */
export function productReference(product: Pick<PublicProduct, "sku" | "model">): string | null {
  return product.sku?.trim() || product.model?.trim() || null;
}

/** Prefilled WhatsApp text for one product. Price only when it is public (always "sin IVA"). */
export function buildProductAdvisorMessage({
  name,
  reference,
  price,
  url,
}: {
  name: string;
  reference: string | null;
  /** Already formatted, e.g. `$ 850.000`. Null when the price is hidden. */
  price: string | null;
  url: string;
}): string {
  const lines = [`Hola, me interesa el producto ${name}.`];
  if (reference) lines.push(`Referencia: ${reference}`);
  if (price) lines.push(`Precio publicado: ${price} sin IVA`);
  lines.push(`Enlace: ${url}`, "¿Me pueden asesorar?");
  return lines.join("\n");
}

/** Prefilled WhatsApp text asking for a quote of one product. */
export function buildProductQuoteMessage({
  name,
  reference,
  url,
}: {
  name: string;
  reference: string | null;
  url: string;
}): string {
  const lines = [`Hola, quisiera solicitar una cotización del producto ${name}.`];
  if (reference) lines.push(`Referencia: ${reference}`);
  lines.push(`Enlace: ${url}`);
  return lines.join("\n");
}

export function buildGenericAdvisorMessage(storeUrl: string): string {
  return `Hola, estoy viendo la tienda de HISTECH y quisiera asesoría para elegir un equipo.\nEnlace: ${storeUrl}`;
}

/** `siteConfig.contact.whatsapp` is a `https://wa.me/<number>` base URL. */
export function buildWhatsAppUrl(base: string, message: string): string {
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

export function buildPhoneUrl(phoneRaw: string): string {
  return `tel:${phoneRaw}`;
}

/** WhatsApp (advice and quote) + phone links for a product, built from `siteConfig.contact` values. */
export function productAdvisorLinks(
  product: PublicProduct,
  { whatsapp, phoneRaw, productUrl }: { whatsapp: string; phoneRaw: string; productUrl: string },
): { whatsapp: string; quote: string; phone: string } {
  const display = getPriceDisplay(product);
  const reference = productReference(product);
  const message = buildProductAdvisorMessage({
    name: product.name,
    reference,
    price: display.kind === "price" ? display.formatted : null,
    url: productUrl,
  });
  const quoteMessage = buildProductQuoteMessage({ name: product.name, reference, url: productUrl });
  return {
    whatsapp: buildWhatsAppUrl(whatsapp, message),
    quote: buildWhatsAppUrl(whatsapp, quoteMessage),
    phone: buildPhoneUrl(phoneRaw),
  };
}
