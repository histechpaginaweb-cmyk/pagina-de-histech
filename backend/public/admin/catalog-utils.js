// Pure helpers for the catalog section of the admin (no DOM access).
// Loaded as a classic script by the browser and required by node:test.
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CatalogUtils = api;
})(typeof self !== "undefined" ? self : this, function () {
  const MAX_PRICE = 2000000000;
  const CURRENCIES = ["COP", "USD"];

  const AVAILABILITY_LABELS = {
    in_stock: "En stock",
    on_request: "Bajo pedido",
    out_of_stock: "Agotado",
  };
  const STATUS_LABELS = { draft: "Borrador", published: "Publicado" };

  /**
   * Parses the price field: "" -> no price, "1.500.000" -> 1500000, "71,19" -> 71.19.
   * Up to 2 decimals; zero, negatives and text are errors. A single group of exactly
   * 3 digits ("1.500") reads as a thousands separator, not as decimals.
   */
  function parsePriceInput(raw) {
    if (raw === null || raw === undefined) return { ok: true, value: null };
    const invalid = { ok: false, error: "El precio debe ser un número mayor que cero, con máximo 2 decimales" };
    if (typeof raw === "number") {
      const cents = raw * 100;
      return Number.isFinite(raw) && raw > 0 && raw <= MAX_PRICE && Math.abs(cents - Math.round(cents)) < 1e-6
        ? { ok: true, value: raw }
        : invalid;
    }
    const text = String(raw).trim();
    if (text === "") return { ok: true, value: null };
    let value;
    if (/^\d{1,3}([.,\s]\d{3})+$/.test(text)) value = Number(text.replace(/\D/g, ""));
    else if (/^\d+([.,]\d{1,2})?$/.test(text)) value = Number(text.replace(",", "."));
    else return invalid;
    if (!(value > 0)) return { ok: false, error: "El precio debe ser mayor que cero" };
    if (value > MAX_PRICE) return { ok: false, error: "El precio es demasiado alto" };
    return { ok: true, value };
  }

  function formatCop(value) {
    if (value === null || value === undefined) return "—";
    return "$" + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /** Price with its currency label: "$1.500.000 COP" or "US$71,19 USD". */
  function formatPrice(value, currency) {
    if (value === null || value === undefined) return "—";
    if (currency === "USD") {
      const [int, dec] = Number(value).toFixed(2).split(".");
      return "US$" + int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + dec + " USD";
    }
    return formatCop(Math.round(value)) + " COP";
  }

  /** Live character counter: "42 / 60", flagged "over" past the recommended size. */
  function counterState(text, ideal) {
    const length = text ? String(text).length : 0;
    return { text: length + " / " + ideal, level: length > ideal ? "over" : "ok" };
  }

  /** Returns a copy of the list with the item at `index` moved by `delta` (clamped). */
  function moveItem(list, index, delta) {
    const target = index + delta;
    const next = list.slice();
    if (index < 0 || index >= next.length || target < 0 || target >= next.length) return next;
    const item = next[index];
    next[index] = next[target];
    next[target] = item;
    return next;
  }

  /** Trims spec rows, drops blank ones and counts half-filled rows (which are not kept). */
  function cleanSpecs(rows) {
    const specs = [];
    let incomplete = 0;
    for (const row of rows || []) {
      const label = String(row.label || "").trim();
      const value = String(row.value || "").trim();
      if (!label && !value) continue;
      if (!label || !value) {
        incomplete += 1;
        continue;
      }
      specs.push({ label, value });
    }
    return { specs, incomplete };
  }

  function cleanImages(rows) {
    return (rows || [])
      .map((row) => ({ url: String(row.url || "").trim(), alt: String(row.alt || "").trim() }))
      .filter((row) => row.url);
  }

  const orNull = (value) => {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
  };

  /** Turns the product form state into the API payload, or a Spanish error message. */
  function buildProductPayload(form) {
    const name = String(form.name || "").trim();
    if (!name) return { ok: false, error: "El nombre es obligatorio" };
    if (!form.categoryId) return { ok: false, error: "Selecciona una categoría" };

    const price = parsePriceInput(form.price);
    if (!price.ok) return { ok: false, error: price.error };

    const { specs, incomplete } = cleanSpecs(form.specs);
    if (incomplete > 0) {
      return {
        ok: false,
        error: "Hay especificaciones incompletas: completa etiqueta y valor, o elimina la fila",
      };
    }

    const payload = {
      name,
      categoryId: form.categoryId,
      brandId: form.brandId || null,
      model: orNull(form.model),
      sku: orNull(form.sku),
      shortDescription: orNull(form.shortDescription),
      description: orNull(form.description),
      price: price.value,
      priceCurrency: CURRENCIES.includes(form.priceCurrency) ? form.priceCurrency : "COP",
      consultPrice: Boolean(form.consultPrice),
      availability: form.availability,
      status: form.status,
      featured: Boolean(form.featured),
      seoTitle: orNull(form.seoTitle),
      seoDescription: orNull(form.seoDescription),
      datasheetUrl: orNull(form.datasheetUrl),
      specs,
      images: cleanImages(form.images),
    };
    const slug = String(form.slug || "").trim();
    if (slug) payload.slug = slug;
    return { ok: true, payload };
  }

  return {
    AVAILABILITY_LABELS,
    STATUS_LABELS,
    parsePriceInput,
    formatCop,
    formatPrice,
    CURRENCIES,
    counterState,
    moveItem,
    cleanSpecs,
    cleanImages,
    buildProductPayload,
  };
});
