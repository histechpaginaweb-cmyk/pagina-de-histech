/**
 * Trae del backend (R2) los textos editables del inicio (sección hero):
 * heroTitle / heroSubtitle. Se ejecuta en el servidor, revalida 60s.
 * Si no hay BACKEND_URL o el backend falla, devuelve {} → el home usa su
 * contenido estático de `site.ts` (fallback, nunca queda vacío).
 */
export type HomeTexts = {
  heroTitle?: string;
  heroSubtitle?: string;
};

export async function getHomeTexts(): Promise<HomeTexts> {
  const base = process.env.BACKEND_URL;
  if (!base) return {};

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/home-texts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: unknown = await res.json();
    if (!data || typeof data !== "object") return {};

    const d = data as Record<string, unknown>;
    return {
      heroTitle: (d.heroTitle as string) || undefined,
      heroSubtitle: (d.heroSubtitle as string) || undefined,
    };
  } catch (err) {
    console.warn("[get-home-texts] backend no disponible, uso estático:", err);
    return {};
  }
}
