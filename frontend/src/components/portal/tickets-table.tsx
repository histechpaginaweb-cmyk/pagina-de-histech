"use client";

// Tabla de tickets reutilizable (cliente y admin). Cada fila enlaza al detalle.
import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/portal/ticket-badges";
import { CATEGORY_LABEL, formatDate } from "@/lib/portal/constants";
import type { TicketSummary } from "@/lib/portal/types";

export function TicketsTable({
  tickets,
  basePath,
  showCompany = false,
}: {
  tickets: TicketSummary[];
  basePath: string; // ej. "/portal/tickets" o "/portal/admin/tickets"
  showCompany?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-5 py-3 font-medium">N.º</th>
            <th className="px-5 py-3 font-medium">Asunto</th>
            {showCompany && <th className="px-5 py-3 font-medium">Empresa</th>}
            <th className="px-5 py-3 font-medium">Categoría</th>
            <th className="px-5 py-3 font-medium">Prioridad</th>
            <th className="px-5 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 font-medium">Creado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              className="border-b border-[#F1F1F4] last:border-0 hover:bg-brand-purple/[0.02]"
            >
              <td className="px-5 py-3">
                <Link href={`${basePath}/${t.id}`} className="font-mono text-xs font-medium text-brand-purple hover:underline">
                  {t.number}
                </Link>
              </td>
              <td className="px-5 py-3">
                <Link href={`${basePath}/${t.id}`} className="font-medium hover:text-brand-purple">
                  {t.subject}
                </Link>
                {t.asset && (
                  <span className="block text-xs text-muted-foreground">{t.asset.name}</span>
                )}
              </td>
              {showCompany && (
                <td className="px-5 py-3 text-muted-foreground">{t.company?.name ?? "—"}</td>
              )}
              <td className="px-5 py-3 text-muted-foreground">
                {t.category ? CATEGORY_LABEL[t.category] : "—"}
              </td>
              <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
              <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
              <td className="px-5 py-3 text-muted-foreground">{formatDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
