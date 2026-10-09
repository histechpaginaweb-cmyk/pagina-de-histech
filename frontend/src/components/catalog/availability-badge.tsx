import { availabilityLabel } from "@/lib/catalog/price";
import type { Availability } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const TONES: Record<Availability, string> = {
  in_stock: "border-[#7C3AED]/25 bg-[#7C3AED]/10 text-[#6D28D9]",
  on_request: "border-[#E5E7EB] bg-muted text-muted-foreground",
  out_of_stock: "border-red-200 bg-red-50 text-red-700",
};

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[availability] ?? TONES.on_request,
        className,
      )}
    >
      {availabilityLabel(availability)}
    </span>
  );
}
