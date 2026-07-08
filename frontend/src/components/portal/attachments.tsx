"use client";

// Galería de imágenes del ticket + cargador (máx. 2 por tipo). Reutiliza el
// endpoint del backend que optimiza y almacena en R2.
import * as React from "react";
import { ImagePlus, X } from "lucide-react";
import { portalApi, PortalApiError, PORTAL_BASE } from "@/lib/portal/api";
import { Alert, Spinner } from "@/components/portal/ui";
import type { TicketAttachment, AttachmentKind } from "@/lib/portal/types";

export function AttachmentGallery({
  title,
  attachments,
}: {
  title: string;
  attachments: TicketAttachment[];
}) {
  if (!attachments.length) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-3">
        {attachments.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block size-24 overflow-hidden rounded-xl border border-[#E5E7EB] transition hover:border-brand-purple"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt="Adjunto" className="size-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

// Cargador para el detalle. `kind` = TECH_EVIDENCE lo usa el admin.
export function AttachmentUploader({
  ticketId,
  kind = "CLIENT",
  existingCount,
  onUploaded,
}: {
  ticketId: string;
  kind?: AttachmentKind;
  existingCount: number;
  onUploaded: () => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const remaining = 2 - existingCount;

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).slice(0, remaining).forEach((f) => fd.append("images", f));
      const qs = kind === "TECH_EVIDENCE" ? "?kind=TECH_EVIDENCE" : "";
      const res = await fetch(`${PORTAL_BASE}/tickets/${ticketId}/attachments${qs}`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new PortalApiError(res.status, data.error || "No se pudo subir la imagen");
      }
      onUploaded();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (remaining <= 0) return null;

  return (
    <div className="space-y-2">
      {error && <Alert variant="error">{error}</Alert>}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#C4B5FD] px-4 py-2 text-sm font-medium text-brand-purple transition hover:bg-brand-purple/[0.05] disabled:opacity-60"
      >
        {uploading ? <Spinner className="size-4" /> : <ImagePlus className="size-4" />}
        Adjuntar imagen ({remaining} restante{remaining === 1 ? "" : "s"})
      </button>
    </div>
  );
}

// Previsualización de imágenes seleccionadas ANTES de crear el ticket.
export function AttachmentPreview({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (i: number) => void;
}) {
  const urls = React.useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  React.useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  if (!files.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {urls.map((u, i) => (
        <div key={u} className="relative size-24 overflow-hidden rounded-xl border border-[#E5E7EB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u} alt="Previsualización" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            aria-label="Quitar"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
