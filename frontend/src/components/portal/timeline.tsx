// Línea de tiempo del ticket (historial de eventos).
import { formatDateTime } from "@/lib/portal/constants";
import type { TicketEvent } from "@/lib/portal/types";

export function Timeline({ events }: { events: TicketEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>;
  }
  return (
    <ol className="relative space-y-5 border-l border-[#E5E7EB] pl-6">
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span className="absolute -left-[27px] top-1 size-3 rounded-full border-2 border-white bg-brand-purple shadow" />
          <p className="text-sm font-medium">{e.action}</p>
          {e.note && <p className="mt-0.5 text-sm text-muted-foreground">{e.note}</p>}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDateTime(e.createdAt)}
            {e.user ? ` · ${e.user.fullName}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
