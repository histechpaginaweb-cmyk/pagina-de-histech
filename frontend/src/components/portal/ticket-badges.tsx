// Badges de estado y prioridad de tickets (reutilizables en listas y detalle).
import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  STATUS_STYLE,
  PRIORITY_LABEL,
  PRIORITY_STYLE,
} from "@/lib/portal/constants";
import type { TicketStatus, TicketPriority } from "@/lib/portal/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLE[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        PRIORITY_STYLE[priority],
      )}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
