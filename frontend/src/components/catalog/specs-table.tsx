import type { ProductSpec } from "@/lib/catalog/types";

export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Especificaciones técnicas</caption>
        <tbody className="divide-y divide-[#E5E7EB]">
          {specs.map((spec, i) => (
            <tr key={`${spec.label}-${i}`} className="odd:bg-muted/40">
              <th scope="row" className="w-2/5 px-4 py-3 align-top font-medium text-foreground sm:px-5">
                {spec.label}
              </th>
              <td className="px-4 py-3 text-foreground/85 sm:px-5">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
