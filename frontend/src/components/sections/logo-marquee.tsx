"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PartnerLogo } from "./partner-logo";
import type { Partner } from "@/lib/partners";

const SPEED = 0.5; // px por frame (~30px/s)

/**
 * Carrusel de logos: flujo continuo automático + ARRASTRABLE con el mouse.
 * Duplica los logos para un bucle sin saltos. Pausa al pasar el cursor o al
 * arrastrar; respeta prefers-reduced-motion. `reverse` invierte la dirección.
 */
export function LogoMarquee({
  partners,
  className,
  reverse = false,
}: {
  partners: Partner[];
  className?: string;
  reverse?: boolean;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const loopWidth = React.useRef(0);
  const paused = React.useRef(false);
  const drag = React.useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const doubled = React.useMemo(() => [...partners, ...partners], [partners]);

  const wrap = React.useCallback(() => {
    const el = scrollerRef.current;
    const w = loopWidth.current;
    if (!el || w <= 0) return;
    if (el.scrollLeft >= w) el.scrollLeft -= w;
    else if (el.scrollLeft < 0) el.scrollLeft += w;
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // El inicio de la 2ª copia marca el ancho de un ciclo (loop perfecto).
    const measure = () => {
      const firstDup = el.children[partners.length] as HTMLElement | undefined;
      loopWidth.current = firstDup ? firstDup.offsetLeft : el.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = reverse ? -1 : 1;
    let raf = 0;
    // `scrollLeft` redondea a entero al leerlo: con velocidades < 1px/frame se
    // perdería la fracción. La acumulamos y avanzamos de a píxeles enteros.
    let acc = 0;
    const tick = () => {
      if (!paused.current && !drag.current.down) {
        acc += SPEED;
        const step = Math.floor(acc);
        if (step >= 1) {
          acc -= step;
          el.scrollLeft += step * dir;
          wrap();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduce) raf = requestAnimationFrame(tick);

    const onEnter = () => (paused.current = true);
    const onLeave = () => (paused.current = false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [partners.length, reverse, wrap]);

  // ── Arrastre con el mouse (desktop). El táctil usa el scroll nativo. ──
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
    wrap();
  };
  const endDrag = () => {
    drag.current.down = false;
  };

  return (
    <div
      ref={scrollerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onDragStart={(e) => e.preventDefault()}
      className={cn(
        "mask-fade-x flex cursor-grab select-none gap-6 overflow-x-auto pb-2 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_img]:[-webkit-user-drag:none]",
        className,
      )}
    >
      {doubled.map((p, i) => (
        <div key={`${p.name}-${i}`} className="shrink-0">
          <PartnerLogo partner={p} />
        </div>
      ))}
    </div>
  );
}
