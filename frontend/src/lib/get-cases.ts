/**
 * Fuente de datos de los casos de éxito. Prioridad: backend (R2) → fallback al
 * seed estático (lib/cases-content.ts) si no hay BACKEND_URL o el backend falla.
 * Se ejecuta en el servidor; la página revalida cada 60s.
 */
import { cases as seedCases, type CaseStudy } from "@/lib/cases-content";

type RawCase = Partial<CaseStudy> & { slug?: string; title?: string };

function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  if (typeof v === "string") {
    return v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalize(r: RawCase): CaseStudy {
  return {
    slug: r.slug ?? "",
    title: r.title ?? "",
    category: r.category ?? "Caso de éxito",
    icon: r.icon ?? "Target",
    challenge: r.challenge ?? "",
    solution: r.solution ?? "",
    result: r.result ?? "",
    metric: r.metric ?? "",
    metricLabel: r.metricLabel ?? "",
    tech: toList(r.tech),
    relatedServices: toList(r.relatedServices),
  };
}

export async function getCases(): Promise<CaseStudy[]> {
  const base = process.env.BACKEND_URL;
  if (!base) return seedCases;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/cases`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: unknown = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return seedCases;
    return (rows as RawCase[]).map(normalize).filter((c) => c.slug && c.title);
  } catch (err) {
    console.warn("[get-cases] backend no disponible, uso seed estático:", err);
    return seedCases;
  }
}
