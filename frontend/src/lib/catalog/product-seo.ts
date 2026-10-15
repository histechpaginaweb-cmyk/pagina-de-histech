import { formatCop, formatUsd, hasVisiblePrice } from "./price";
import type { PublicProduct } from "./types";

/** Max length of the product <title> before the " | HISTECH" suffix added by buildMetadata. */
export const TITLE_MAX = 65;
/** Target length of the meta description. */
export const DESCRIPTION_MAX = 160;

const TITLE_SUFFIX = " – Precio";
const DESCRIPTION_TAIL = "Asesoría y cotización inmediata con HISTECH.";
const CONSULT_PRICE_TEXT = "Consulta el precio con un asesor.";

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function portsLabel(text: string): string {
  const match = text.match(/(\d+)\s*puertos?/);
  if (!match) return "";
  return `${match[1]} ${match[1] === "1" ? "puerto" : "puertos"}`;
}

function ethernetSpeed(text: string): string {
  if (/multi-?ge|multi-?gigabit|2\.5\s*g(?:b|e)/.test(text)) return "Multi-Gigabit";
  if (/gigabit|10\/100\/1000|\bge\b/.test(text)) return "Gigabit";
  if (/10\/100(?!\/)/.test(text)) return "Fast Ethernet";
  return "";
}

function opticalSpeed(text: string): string {
  const match = text.match(/(\d+(?:\.\d+)?)\s*g(?:b|base)/);
  if (match) return `${match[1]}G`;
  if (/1000\s*base/.test(text)) return "1G";
  return "";
}

function sfpVariant(text: string): string {
  if (/sfp28/.test(text)) return "SFP28";
  if (/qsfp/.test(text)) return "QSFP";
  if (/sfp\+/.test(text)) return "SFP+";
  if (/sfp/.test(text)) return "SFP";
  return "";
}

function fiberMode(text: string): string {
  if (/monomodo|single.?mode/.test(text)) return "Monomodo";
  if (/multimodo|multi.?mode/.test(text)) return "Multimodo";
  return "";
}

const join = (...parts: string[]) => parts.filter(Boolean).join(" ");

/**
 * Short product type for titles ("Switch PoE 24 puertos Gigabit", "Transceptor SFP+ 10G
 * Monomodo"), derived from the long Syscom title. Returns "" when nothing is recognizable.
 */
export function extractProductType(shortDescription: string | null | undefined): string {
  const original = shortDescription?.trim() ?? "";
  if (!original) return "";
  const text = fold(original);

  if (/paquete de expansion/.test(text)) return "Licencia de expansión";
  if (/\blicencia\b/.test(text)) {
    if (/perpetua/.test(text)) return "Licencia perpetua";
    const years = text.match(/(\d+)\s*anos?/);
    if (years) return `Licencia ${years[1]} ${years[1] === "1" ? "año" : "años"}`;
    return "Licencia";
  }
  if (/^tarjeta\b/.test(text)) return join("Tarjeta", portsLabel(text), ethernetSpeed(text));
  if (/^fuente de (?:alimentacion|poder)/.test(text)) {
    return join("Fuente de alimentación", original.match(/\d+\s*W\b/i)?.[0] ?? "");
  }
  if (/jumper/.test(text)) return join("Jumper de fibra", sfpVariant(text), opticalSpeed(text));
  if (/cable\s+optico|aoc/.test(text)) return "Cable óptico";
  if (/transceptor|transceiver|mini-gbic/.test(text)) {
    return join("Transceptor", sfpVariant(text), opticalSpeed(text), fiberMode(text));
  }
  if (/inyector/.test(text)) {
    const watts = original.match(/\d+\s*W\b/)?.[0] ?? "";
    return join("Inyector PoE", ethernetSpeed(text), watts);
  }
  if (/adaptador\s+poe/.test(text)) return join("Adaptador PoE", portsLabel(text));

  // Network devices: the earliest keyword wins ("Switch ... firewall" is a switch).
  const candidates: [string, number][] = [
    ["Switch", text.search(/\bswitch\b/)],
    ["Router", text.search(/\brouter\b/)],
    ["Gateway", text.search(/\bgateway\b/)],
    ["Firewall", text.search(/\bfirewall\b/)],
  ];
  const found = candidates.filter(([, index]) => index >= 0).sort((a, b) => a[1] - b[1])[0];
  if (!found) return "";
  const [kind] = found;
  if (kind === "Firewall") return "Firewall";
  const hasPoe = /poe/.test(text.replace(/non-?poe|(?:sin|no)\s+poe/g, ""));
  return join(kind, hasPoe ? "PoE" : "", portsLabel(text), ethernetSpeed(text));
}

const partNumber = (product: Pick<PublicProduct, "model" | "sku">) => product.model?.trim() || product.sku?.trim() || "";

function fitTitle(ref: string, brand: string, type: string): string {
  const build = (t: string) => `${join(ref, brand, t)}${TITLE_SUFFIX}`;
  let words = type.split(" ").filter(Boolean);
  while (words.length > 0 && build(words.join(" ")).length > TITLE_MAX) words = words.slice(0, -1);
  // Never leave a dangling quantity such as "Switch PoE 48".
  while (words.length > 1 && /^\d+$/.test(words[words.length - 1])) words = words.slice(0, -1);
  return build(words.join(" "));
}

/** `<MODEL> <Brand> <type> – Precio` (part number first). The admin `seoTitle` wins verbatim. */
export function buildProductTitle(product: PublicProduct): string {
  const override = product.seoTitle?.trim();
  if (override) return override;
  const ref = partNumber(product);
  if (!ref) return `${product.name}${TITLE_SUFFIX}`;
  return fitTitle(ref, product.brand?.name ?? "", extractProductType(product.shortDescription));
}

function cleanDescription(text: string | null | undefined, ref: string): string {
  let out = (text ?? "").replace(/&#?[a-z0-9]+;?/gi, "").replace(/\s+/g, " ").trim();
  if (ref && out.toLowerCase().startsWith(ref.toLowerCase())) {
    out = out.slice(ref.length).replace(/^[\s,:;\-–.]+/, "");
  }
  return out.replace(/[\s.,;:]+$/, "");
}

function trimToFit(text: string, max: number): string {
  if (text.length <= max) return text;
  if (max <= 1) return "";
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const base = space > 10 ? cut.slice(0, space) : cut;
  return `${base.replace(/[\s.,;:\-–/+(]+$/, "")}…`;
}

/** Meta description with the price (IVA included) or the consult text. The admin `seoDescription` wins verbatim. */
export function buildProductDescription(product: PublicProduct): string {
  const override = product.seoDescription?.trim();
  if (override) return override;

  const ref = partNumber(product);
  const brand = product.brand?.name;
  const head = ref ? `${ref}${brand ? ` de ${brand}` : ""}` : product.name;
  const price = hasVisiblePrice(product)
    ? `Precio ${product.priceCurrency === "USD" ? formatUsd(product.price) : formatCop(product.price)} IVA incluido en Colombia.`
    : CONSULT_PRICE_TEXT;
  const tail = `${price} ${DESCRIPTION_TAIL}`;

  const description = cleanDescription(product.shortDescription, ref);
  if (!description) return `${head}. ${tail}`;

  // head + ": " + description + ". " + tail
  const available = DESCRIPTION_MAX - (head.length + 2 + 2 + tail.length);
  const fitted = trimToFit(description, available);
  if (!fitted) return `${head}. ${tail}`;
  return `${head}: ${fitted}${fitted.endsWith("…") ? "" : "."} ${tail}`;
}

/** Part-number spellings installers type in Google: no separators, hyphens as spaces. */
export function searchAliases(partNumberValue: string | null | undefined): string[] {
  const original = partNumberValue?.trim() ?? "";
  if (!original) return [];
  const variants = [original.replace(/[-\s]+/g, ""), original.replace(/-/g, " ").replace(/\s+/g, " ")];
  return [...new Set(variants)].filter((v) => v && v !== original);
}

/** Distinct, non-empty part references (model, sku): one entry when both are equal. */
export function productReferences(product: Pick<PublicProduct, "model" | "sku">): string[] {
  const values = [product.model, product.sku].map((v) => v?.trim()).filter((v): v is string => Boolean(v));
  return [...new Set(values)];
}

/** Open Graph product tags (`other` metadata); price tags only when the price is public. */
export function productOpenGraphMeta(product: PublicProduct): Record<string, string> {
  return {
    "og:type": "product",
    ...(hasVisiblePrice(product) && {
      "product:price:amount": String(product.price),
      "product:price:currency": product.priceCurrency,
    }),
  };
}
