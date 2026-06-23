"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { products, type Product } from "@/lib/products";

const SPEED = 0.4; // px por frame (~24px/s) — ritmo de pasarela, legible

export function ProductCarousel({ items = products }: { items?: Product[] }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const loopWidth = React.useRef(0);
  const paused = React.useRef(false);
  const drag = React.useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  // Tarjetas duplicadas para un bucle continuo sin saltos.
  const loop = React.useMemo(() => [...items, ...items], [items]);

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

    // El inicio de la 2ª copia marca el ancho exacto de un ciclo (loop perfecto).
    const measure = () => {
      const firstDup = el.children[items.length] as HTMLElement | undefined;
      loopWidth.current = firstDup ? firstDup.offsetLeft : el.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    // `scrollLeft` se redondea a enteros al leerlo, así que velocidades < 1px/frame
    // se pierden. Acumulamos la fracción y avanzamos de a píxeles enteros.
    let acc = 0;
    const tick = () => {
      if (!paused.current && !drag.current.down) {
        acc += SPEED;
        const step = Math.floor(acc);
        if (step >= 1) {
          acc -= step;
          el.scrollLeft += step;
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
  }, [items.length, wrap]);

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
  // Evita que un arrastre dispare el click del enlace de la tarjeta.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Section id="productos" className="pb-16 pt-1 sm:pb-20 sm:pt-2">
      <Container>
        {/* Pasarela: flujo continuo + arrastrable con el cursor */}
        <div
          ref={scrollerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onClickCapture={onClickCapture}
          className="mask-fade-x flex cursor-grab select-none gap-5 overflow-x-auto pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loop.map((p, i) => (
            <ProductCard
              key={`${p.id}-${i}`}
              product={p}
              duplicate={i >= items.length}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProductCard({
  product,
  duplicate = false,
}: {
  product: Product;
  duplicate?: boolean;
}) {
  const { badge, title, excerpt, image, icon, href } = product;
  return (
    <article
      data-card
      aria-hidden={duplicate || undefined}
      className="group flex w-[85%] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04),0_10px_30px_-18px_rgba(17,24,39,0.12)] transition hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-[0_22px_48px_-24px_rgba(124,58,237,0.32)] sm:w-[46%] lg:w-[31.5%]"
    >
      {/* Imagen / placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            draggable={false}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#7C3AED]/10 via-[#F3F4F6] to-white">
            <Icon name={icon ?? "Sparkles"} className="size-14 text-brand-purple/70" />
          </div>
        )}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-[#E5E7EB] bg-white/90 px-3 py-1 text-xs font-medium text-[#111827] backdrop-blur">
            {badge}
          </span>
        ) : null}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
        {href ? (
          <Link
            href={href}
            draggable={false}
            tabIndex={duplicate ? -1 : undefined}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan transition hover:gap-2"
          >
            Leer más
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
