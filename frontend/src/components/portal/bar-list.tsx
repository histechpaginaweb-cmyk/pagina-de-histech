"use client";

// Lista de barras horizontales (distribuciones del dashboard). Magnitud por
// identidad: etiqueta + valor siempre visibles (nunca color solo). Por defecto
// una sola tinta de marca (púrpura) para magnitud; opcionalmente cada barra
// puede traer su color de estado/prioridad (paleta reservada, con etiqueta).
import { cn } from "@/lib/utils";

export type BarItem = { label: string; value: number; barClass?: string };

export function BarList({ items, emptyLabel = "Sin datos." }: { items: BarItem[]; emptyLabel?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const visible = items.filter((i) => i.value > 0);

  if (visible.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-3">
      {visible.map((it) => (
        <li key={it.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-foreground" title={it.label}>
            {it.label}
          </span>
          <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#EEF0F4]">
            <span
              className={cn("absolute inset-y-0 left-0 rounded-full", it.barClass || "bg-brand-purple")}
              style={{ width: `${Math.max(4, (it.value / max) * 100)}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
            {it.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
