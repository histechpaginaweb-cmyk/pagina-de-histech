import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo oficial de HISTECH (isotipo + wordmark) sobre fondo transparente.
 * Asset: public/logo-histech.webp — procesado desde el MASTER limpio
 * logo-histech.jpg (degradado azul→púrpura, bordes nítidos, SIN glow; "Opción B"
 * elegida por el usuario). Ver scripts/process-logo.mjs (white-to-alpha).
 * Proporción 820 × 253 (3.24:1) — actualizar si se reprocesa (el trim la cambia).
 * El ?v= rompe la caché del navegador cuando se regenera el asset (mismo nombre).
 */
const LOGO_SRC = "/logo-histech.webp?v=4";

export function LogoImage({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="HISTECH"
      width={820}
      height={253}
      draggable={false}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
}

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center rounded-lg", className)}
      aria-label="HISTECH — Inicio"
    >
      <LogoImage className="h-12 transition-transform duration-300 group-hover:scale-[1.03]" />
    </Link>
  );
}
