"use client";

// Crear ticket (Cliente). El número es automático (lo asigna el backend).
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { PortalShell } from "@/components/portal/shell";
import { PortalCard, Field, Input, Textarea, Select, Alert, Spinner } from "@/components/portal/ui";
import { AttachmentPreview } from "@/components/portal/attachments";
import { usePortalAuth } from "@/components/portal/auth-context";
import { portalApi, PortalApiError, PORTAL_BASE } from "@/lib/portal/api";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "@/lib/portal/constants";
import type { Asset, Ticket } from "@/lib/portal/types";

export default function NewTicketPage() {
  const router = useRouter();
  const { user } = usePortalAuth();
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [form, setForm] = React.useState({
    assetId: "",
    area: "",
    category: "HARDWARE",
    priority: "MEDIA",
    subject: "",
    description: "",
  });
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    portalApi
      .get<Asset[]>(`/companies/${user.companyId}/assets`)
      .then((a) => setAssets(a.filter((x) => x.status === "ACTIVE")))
      .catch(() => setAssets([]));
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 2));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ticket = await portalApi.post<Ticket>("/tickets", {
        assetId: form.assetId || undefined,
        area: form.area || undefined,
        category: form.category,
        priority: form.priority,
        subject: form.subject.trim(),
        description: form.description.trim(),
      });
      // Subir adjuntos (si hay), sin bloquear el flujo si fallan.
      if (files.length) {
        const fd = new FormData();
        files.slice(0, 2).forEach((f) => fd.append("images", f));
        await fetch(`${PORTAL_BASE}/tickets/${ticket.id}/attachments`, {
          method: "POST",
          credentials: "include",
          body: fd,
        }).catch(() => {});
      }
      router.replace(`/portal/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo crear el ticket.");
      setSubmitting(false);
    }
  }

  return (
    <PortalShell requiredRole="CLIENT">
      <Link
        href="/portal/tickets"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-brand-purple"
      >
        <ArrowLeft className="size-4" /> Volver a mis tickets
      </Link>
      <h1 className="mb-6 text-display-lg">Crear ticket</h1>

      <PortalCard className="max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error && <Alert variant="error">{error}</Alert>}

          <Field label="Equipo" htmlFor="t-asset" hint="Opcional. Asocia el ticket a un equipo de tu inventario.">
            <Select id="t-asset" value={form.assetId} onChange={set("assetId")}>
              <option value="">Sin equipo asociado</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.internalCode} — {a.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Área" htmlFor="t-area">
              <Input id="t-area" value={form.area} onChange={set("area")} placeholder="Ej. Contabilidad" />
            </Field>
            <Field label="Categoría" htmlFor="t-cat" required>
              <Select id="t-cat" value={form.category} onChange={set("category")}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Prioridad" htmlFor="t-prio" required>
            <Select id="t-prio" value={form.priority} onChange={set("priority")}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </Field>

          <Field label="Asunto" htmlFor="t-subject" required>
            <Input id="t-subject" value={form.subject} onChange={set("subject")} placeholder="Resumen breve del problema" required />
          </Field>

          <Field label="Descripción detallada" htmlFor="t-desc" required>
            <Textarea id="t-desc" rows={5} value={form.description} onChange={set("description")} placeholder="Describe el problema con el mayor detalle posible…" required />
          </Field>

          <Field label="Imágenes" htmlFor="t-img" hint="Máximo 2 imágenes (JPG, PNG, WebP o GIF).">
            <input
              id="t-img"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(e) => addFiles(e.target.files)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-brand-purple/[0.08] file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-purple hover:file:bg-brand-purple/[0.14]"
              disabled={files.length >= 2}
            />
          </Field>
          <AttachmentPreview files={files} onRemove={(i) => setFiles((f) => f.filter((_, idx) => idx !== i))} />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gradient px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? <Spinner className="size-4" /> : <Send className="size-4" />}
              Crear ticket
            </button>
          </div>
        </form>
      </PortalCard>
    </PortalShell>
  );
}
