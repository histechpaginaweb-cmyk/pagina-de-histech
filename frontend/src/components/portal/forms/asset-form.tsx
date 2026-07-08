"use client";

// Formulario reutilizable de Equipo (Activo). Crear/editar dentro de una empresa.
import * as React from "react";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import { Field, Input, Textarea, Select, Alert, Spinner } from "@/components/portal/ui";
import type { Asset, PortalUser, EntityStatus } from "@/lib/portal/types";

export function AssetForm({
  companyId,
  asset,
  users,
  onSaved,
  onCancel,
}: {
  companyId: string;
  asset?: Asset;
  users: PortalUser[];
  onSaved: (a: Asset) => void;
  onCancel: () => void;
}) {
  const editing = Boolean(asset);
  const [f, setF] = React.useState({
    internalCode: asset?.internalCode ?? "",
    name: asset?.name ?? "",
    assignedUserId: asset?.assignedUserId ?? "",
    location: asset?.location ?? "",
    brand: asset?.brand ?? "",
    model: asset?.model ?? "",
    serialNumber: asset?.serialNumber ?? "",
    observations: asset?.observations ?? "",
    status: (asset?.status ?? "ACTIVE") as EntityStatus,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      internalCode: f.internalCode.trim(),
      name: f.name.trim(),
      assignedUserId: f.assignedUserId || null,
      location: f.location,
      brand: f.brand,
      model: f.model,
      serialNumber: f.serialNumber,
      observations: f.observations,
      status: f.status,
    };
    try {
      const saved = editing
        ? await portalApi.put<Asset>(`/assets/${asset!.id}`, payload)
        : await portalApi.post<Asset>(`/companies/${companyId}/assets`, payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código interno" htmlFor="a-code" required>
          <Input id="a-code" value={f.internalCode} onChange={set("internalCode")} placeholder="Ej. PC-001" required />
        </Field>
        <Field label="Nombre del equipo" htmlFor="a-name" required>
          <Input id="a-name" value={f.name} onChange={set("name")} placeholder="Ej. Laptop Contabilidad" required />
        </Field>
      </div>

      <Field label="Usuario asignado" htmlFor="a-user" hint="Opcional.">
        <Select id="a-user" value={f.assignedUserId} onChange={set("assignedUserId")}>
          <option value="">Sin asignar</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.fullName}</option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ubicación" htmlFor="a-loc">
          <Input id="a-loc" value={f.location ?? ""} onChange={set("location")} />
        </Field>
        <Field label="Estado" htmlFor="a-status">
          <Select id="a-status" value={f.status} onChange={set("status")}>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Marca" htmlFor="a-brand">
          <Input id="a-brand" value={f.brand ?? ""} onChange={set("brand")} />
        </Field>
        <Field label="Modelo" htmlFor="a-model">
          <Input id="a-model" value={f.model ?? ""} onChange={set("model")} />
        </Field>
        <Field label="N.º de serie" htmlFor="a-serial">
          <Input id="a-serial" value={f.serialNumber ?? ""} onChange={set("serialNumber")} />
        </Field>
      </div>

      <Field label="Observaciones" htmlFor="a-obs">
        <Textarea id="a-obs" rows={2} value={f.observations ?? ""} onChange={set("observations")} />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-full border border-[#E5E7EB] px-5 text-sm font-medium text-[#374151] transition hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {saving && <Spinner className="size-4" />}
          {editing ? "Guardar cambios" : "Crear equipo"}
        </button>
      </div>
    </form>
  );
}
