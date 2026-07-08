"use client";

// Formulario reutilizable de Empresa (crear / editar).
import * as React from "react";
import { portalApi, PortalApiError } from "@/lib/portal/api";
import { Field, Input, Textarea, Select, Alert, Spinner } from "@/components/portal/ui";
import type { Company } from "@/lib/portal/types";

export function CompanyForm({
  company,
  onSaved,
  onCancel,
}: {
  company?: Company;
  onSaved: (c: Company) => void;
  onCancel: () => void;
}) {
  const editing = Boolean(company);
  const [name, setName] = React.useState(company?.name ?? "");
  const [status, setStatus] = React.useState(company?.status ?? "ACTIVE");
  const [internalNotes, setInternalNotes] = React.useState(company?.internalNotes ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = { name: name.trim(), status, internalNotes };
    try {
      const saved = editing
        ? await portalApi.put<Company>(`/companies/${company!.id}`, payload)
        : await portalApi.post<Company>("/companies", payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      <Field label="Nombre de la empresa" htmlFor="c-name" required>
        <Input
          id="c-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Comercializadora Andina S.A.S."
          required
        />
      </Field>

      <Field label="Estado" htmlFor="c-status">
        <Select
          id="c-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Company["status"])}
        >
          <option value="ACTIVE">Activa</option>
          <option value="INACTIVE">Inactiva</option>
        </Select>
      </Field>

      <Field label="Observaciones internas" htmlFor="c-notes" hint="Solo visibles para HISTECH.">
        <Textarea
          id="c-notes"
          rows={3}
          value={internalNotes ?? ""}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Notas internas sobre la empresa…"
        />
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
          {editing ? "Guardar cambios" : "Crear empresa"}
        </button>
      </div>
    </form>
  );
}
