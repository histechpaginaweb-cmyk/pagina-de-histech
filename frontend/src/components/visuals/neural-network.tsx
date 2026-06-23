"use client";

import * as React from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

type NeuralNetworkProps = {
  className?: string;
  /** Color de las líneas/datos como "r, g, b". Default: azul-indigo frío. */
  lineRGB?: string;
  /** Color de los nodos como "r, g, b". Default: azul claro suave. */
  nodeRGB?: string;
  /** Escala de velocidad (menor = más lento). Default 0.12 (muy lento). */
  speed?: number;
  /** Opacidad máxima de los enlaces. Default 0.22 (baja). */
  linkOpacity?: number;
  /** Opacidad de los nodos. Default 0.5 (baja). */
  nodeOpacity?: number;
  /** Densidad: px² por nodo (mayor = menos nodos). Default 27000. */
  area?: number;
  /** Tope de nodos. Default 48. */
  cap?: number;
};

/**
 * Animated neural-network / particle field rendered on <canvas>.
 * - DPR-aware, pauses when offscreen (IntersectionObserver) and on reduced-motion.
 * - Ligero y elegante (estética enterprise): nodos + enlaces por distancia,
 *   movimiento muy lento y baja opacidad para servir de fondo discreto.
 */
export function NeuralNetwork({
  className,
  lineRGB = "96, 122, 200",
  nodeRGB = "132, 160, 235",
  speed = 0.12,
  linkOpacity = 0.22,
  nodeOpacity = 0.5,
  area = 27000,
  cap = 48,
}: NeuralNetworkProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    let mouse = { x: -9999, y: -9999 };

    const COUNT = () => Math.min(cap, Math.floor((width * height) / area));
    const LINK_DIST = 165;

    function seed() {
      const n = COUNT();
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.5 + 1,
      }));
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // subtle mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 120) {
          p.x += (mdx / md) * 0.8;
          p.y += (mdy / md) * 0.8;
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * linkOpacity;
            ctx!.strokeStyle = `rgba(${lineRGB},${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // nodes
      for (const p of nodes) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${nodeRGB},${nodeOpacity})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (raf) return;
      raf = requestAnimationFrame(draw);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) start();
        else stop();
      },
      { threshold: 0 },
    );

    const onMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouse = { x: -9999, y: -9999 });

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    io.observe(canvas);

    if (reduce) {
      draw(); // single static frame
      stop();
    } else if (visible) {
      start();
    }

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [lineRGB, nodeRGB, speed, linkOpacity, nodeOpacity, area, cap]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block" }}
    />
  );
}
