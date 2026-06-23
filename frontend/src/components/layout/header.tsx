"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const pathname = usePathname();

  // Todo el sitio usa el tema claro premium.
  const light = true;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  React.useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // lock scroll when mobile menu open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const headerClass = light
    ? scrolled
      ? "border-b border-[#E5E7EB] bg-white/85 shadow-[0_8px_30px_-12px_rgba(17,24,39,0.14)] backdrop-blur-xl"
      : "border-b border-[#E5E7EB]/60 bg-white/70 backdrop-blur-xl"
    : scrolled
      ? "border-b border-white/10 bg-[#050816]/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      : "border-b border-white/5 bg-gradient-to-b from-[#07112D]/75 via-[#07112D]/25 to-transparent backdrop-blur-[6px]";

  const linkClass = (active: boolean) =>
    cn(
      "whitespace-nowrap rounded-full px-3.5 py-2 text-base font-medium transition",
      light
        ? "text-[#374151] hover:bg-[#7C3AED]/[0.06] hover:text-[#7C3AED]"
        : "text-white/85 hover:bg-white/5 hover:text-[#A855F7]",
      active && (light ? "text-[#111827]" : "text-white"),
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        headerClass,
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-brand-purple focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Saltar al contenido
      </a>

      <nav
        className="container flex h-16 items-center justify-between gap-4 lg:h-18"
        aria-label="Principal"
      >
        {/* Logo del header retirado (a pedido). Sin espaciador: el menú se
            desplaza a la izquierda y aprovecha ese ancho (evita apeñuscar items). */}

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.groups ? (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  className={cn(linkClass(false), "flex items-center gap-1")}
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
                {openMenu === item.label && (
                  <MegaMenu groups={item.groups} light={light} />
                )}
              </li>
            ) : (
              <li key={item.label}>
                <Link href={item.href!} className={linkClass(pathname === item.href)}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/agenda-consultoria" size="sm">
            Agenda una consultoría
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg lg:hidden",
            light ? "text-[#111827]" : "text-foreground",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && <MobileMenu onClose={() => setOpen(false)} light={light} />}
    </header>
  );
}

function MegaMenu({
  groups,
  light,
}: {
  groups: NonNullable<(typeof mainNav)[number]["groups"]>;
  light: boolean;
}) {
  const multiGroup = groups.length > 1;
  return (
    <>
      {/* Puente invisible: mantiene el hover al bajar el cursor del botón al panel */}
      <div className="absolute left-0 top-full h-5 w-full" aria-hidden />

      <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4 lg:top-[4.5rem]">
        <div
          className={cn(
            "pointer-events-auto animate-fade-up w-full max-w-6xl rounded-3xl border p-8 backdrop-blur-2xl lg:p-10",
            light
              ? "border-[#E5E7EB] bg-white/95 shadow-[0_30px_80px_-30px_rgba(17,24,39,0.28)]"
              : "border-white/10 bg-brand-space/95 shadow-card",
          )}
        >
          <div
            className={cn(
              "grid gap-x-10 gap-y-8",
              multiGroup ? "lg:grid-cols-2" : "grid-cols-1",
            )}
          >
            {groups.map((group) => (
              <div key={group.label} className="space-y-3">
                <p
                  className={cn(
                    "px-4 pb-2 text-sm font-semibold uppercase tracking-widest",
                    light ? "text-[#7C3AED]" : "text-brand-cyan/80",
                  )}
                >
                  {group.label}
                </p>
                <div
                  className={cn(
                    "grid gap-x-6 gap-y-1",
                    multiGroup ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {group.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={cn(
                        "group/item block rounded-2xl px-4 py-3 transition",
                        light ? "hover:bg-[#7C3AED]/[0.05]" : "hover:bg-white/5",
                      )}
                    >
                      <span
                        className={cn(
                          "block text-base font-semibold transition",
                          light
                            ? "text-[#111827] group-hover/item:text-[#7C3AED]"
                            : "text-foreground group-hover/item:text-brand-cyan",
                        )}
                      >
                        {it.label}
                      </span>
                      {it.description && (
                        <span
                          className={cn(
                            "mt-1 block text-sm leading-relaxed",
                            light ? "text-[#6B7280]" : "text-muted-foreground",
                          )}
                        >
                          {it.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MobileMenu({ onClose, light }: { onClose: () => void; light: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-40 overflow-y-auto backdrop-blur-xl lg:hidden",
        light ? "bg-white/98" : "bg-brand-space/98",
      )}
    >
      <div className="container space-y-2 py-6">
        {mainNav.map((item) =>
          item.groups ? (
            <details
              key={item.label}
              className={cn(
                "group rounded-xl border",
                light ? "border-[#E5E7EB]" : "border-white/10",
              )}
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium",
                  light ? "text-[#111827]" : "text-foreground",
                )}
              >
                {item.label}
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="space-y-1 px-2 pb-3">
                {item.groups.flatMap((g) => g.items).map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onClose}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm",
                      light
                        ? "text-[#374151] hover:bg-[#7C3AED]/[0.05]"
                        : "text-foreground/80 hover:bg-white/5",
                    )}
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link
              key={item.label}
              href={item.href!}
              onClick={onClose}
              className={cn(
                "block rounded-xl border px-4 py-3 text-sm font-medium",
                light
                  ? "border-[#E5E7EB] text-[#111827] hover:bg-[#7C3AED]/[0.05]"
                  : "border-white/10 hover:bg-white/5",
              )}
            >
              {item.label}
            </Link>
          ),
        )}
        <div className="flex flex-col gap-3 pt-4">
          <Button href="/agenda-consultoria" onClick={onClose}>
            Agenda una consultoría
          </Button>
        </div>
      </div>
    </div>
  );
}
