/**
 * Trae del backend (R2) los textos editables de las páginas de servicio
 * (title / subtitle / intro por slug). Se ejecuta en el servidor, revalida 60s.
 * Si no hay BACKEND_URL o el backend falla, devuelve {} → la página usa su
 * contenido estático de `services-content.ts` (fallback, nunca queda vacía).
 */
export type ServiceTextOverride = {
  title?: string;
  subtitle?: string;
  intro?: string;
};

export async function getServiceTexts(): Promise<
  Record<string, ServiceTextOverride>
> {
  const base = process.env.BACKEND_URL;
  if (!base) return {};

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/service-texts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) return {};

    const map: Record<string, ServiceTextOverride> = {};
    for (const r of rows as Record<string, unknown>[]) {
      if (r && typeof r.slug === "string") {
        map[r.slug] = {
          title: (r.title as string) || undefined,
          subtitle: (r.subtitle as string) || undefined,
          intro: (r.intro as string) || undefined,
        };
      }
    }
    return map;
  } catch (err) {
    console.warn("[get-service-texts] backend no disponible, uso estático:", err);
    return {};
  }
}
