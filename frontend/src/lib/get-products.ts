import { products as seed, type Product } from "@/lib/products";

/**
 * Obtiene los productos del backend (Render) para el carrusel.
 * - Se ejecuta en el servidor (Server Component), revalida cada 60s.
 * - Si BACKEND_URL no está definido o el backend no responde, usa el SEED local
 *   (así el sitio nunca se queda sin tarjetas).
 */
export async function getProducts(): Promise<Product[]> {
  const base = process.env.BACKEND_URL;
  if (!base) return seed;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rows: unknown = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return seed;

    return rows.map(
      (r: Record<string, unknown>): Product => ({
        id: String(r.id),
        badge: (r.badge as string) || undefined,
        title: String(r.title ?? ""),
        excerpt: (r.excerpt as string) || "",
        image: (r.image as string) || undefined,
        icon: (r.icon as string) || undefined,
        href: (r.href as string) || undefined,
      }),
    );
  } catch (err) {
    console.warn("[get-products] backend no disponible, usando seed:", err);
    return seed;
  }
}
