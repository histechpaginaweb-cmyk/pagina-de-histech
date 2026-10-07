"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Icon } from "@/components/ui/icon";
import { products, type Product } from "@/lib/products";

const SPEED = 0.24; // px por frame (~14px/s) — ritmo de pasarela, legible

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
          className="flex cursor-grab [-webkit-mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] select-none gap-5 overflow-x-auto pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

/** Íconos secundarios que acompañan al principal en la ilustración de la tarjeta. */
const SATELLITES: Record<string, [string, string, string]> = {
  ShieldCheck: ["Eye", "Network", "Server"],
  Cloud: ["Server", "ShieldCheck", "Activity"],
  Workflow: ["Cloud", "Layers", "Sparkles"],
  Server: ["Network", "Cpu", "Cloud"],
  BrainCircuit: ["Sparkles", "Workflow", "Activity"],
  Activity: ["Eye", "Server", "ShieldCheck"],
};
const DEFAULT_SATELLITES: [string, string, string] = ["Network", "Layers", "Sparkles"];

// Posición de cada ícono secundario en % del lienzo (16:10); el SVG usa las mismas coordenadas.
const NODES = [
  { x: 17.5, y: 36 },
  { x: 82.5, y: 28 },
  { x: 24, y: 76 },
];

/** Ilustración de marca para las tarjetas sin imagen propia. */
function CardArt({ icon }: { icon: string }) {
  const satellites = SATELLITES[icon] ?? DEFAULT_SATELLITES;
  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#A855F7]">
      {/* Retícula y brillos de fondo */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />
      <span aria-hidden className="absolute -left-10 -top-12 size-44 rounded-full bg-[#C084FC]/50 blur-3xl" />
      <span aria-hidden className="absolute -bottom-14 -right-6 size-48 rounded-full bg-[#22D3EE]/25 blur-3xl" />

      {/* Conexiones entre el ícono principal y los secundarios */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {NODES.map((n) => (
          <line
            key={`${n.x}-${n.y}`}
            x1="50"
            y1="50"
            x2={n.x}
            y2={n.y}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Anillos y ícono principal */}
      <span aria-hidden className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <span aria-hidden className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/30" />
      <div className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/40 bg-white/15 shadow-[0_18px_40px_-12px_rgba(17,24,39,0.55)] backdrop-blur transition duration-500 group-hover:scale-110">
        <Icon name={icon} className="size-10 text-white" />
      </div>

      {satellites.map((name, i) => (
        <div
          key={name}
          style={{ left: `${NODES[i].x}%`, top: `${NODES[i].y}%` }}
          className="absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/30 bg-white/15 backdrop-blur"
        >
          <Icon name={name} className="size-5 text-white/90" />
        </div>
      ))}

    </div>
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
      className="group relative flex w-[85%] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04),0_10px_30px_-18px_rgba(17,24,39,0.12)] transition hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-[0_22px_48px_-24px_rgba(124,58,237,0.32)] sm:w-[46%] lg:w-[31.5%]"
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
          <CardArt icon={icon ?? "Sparkles"} />
        )}
        {/* Marca HISTECH sobre la imagen */}
        <span className="absolute bottom-3 right-3 rounded-lg border border-[#E5E7EB] bg-white/90 px-2.5 py-1.5 backdrop-blur">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-histech.webp"
            alt=""
            aria-hidden
            draggable={false}
            className="h-4 w-auto"
          />
        </span>
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
            // El pseudo-elemento extiende el enlace a toda la tarjeta.
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan transition after:absolute after:inset-0 after:content-[''] group-hover:gap-2"
          >
            Leer más
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
