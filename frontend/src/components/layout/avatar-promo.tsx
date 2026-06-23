"use client";

import * as React from "react";
import { Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";

const MP4_SRC = "/videos/avatar-corporativo.mp4";
const POSTER_SRC = "/videos/avatar-corporativo-poster.jpg";
const DISMISS_KEY = "histech-avatar-dismissed";

/**
 * Avatar corporativo flotante (solo home).
 * - Inicia PAUSADO mostrando el poster (sin descargar el video → no afecta carga).
 * - Al primer clic/toque en CUALQUIER parte de la página, se reproduce UNA vez
 *   CON sonido (permitido porque arranca con un gesto del usuario).
 * - Al terminar queda el botón "Repetir".
 */
export function AvatarPromo() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);
  const [started, setStarted] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [ended, setEnded] = React.useState(false);

  // No mostrar si el usuario ya lo cerró en esta sesión.
  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) setVisible(false);
    } catch {
      /* sessionStorage no disponible */
    }
  }, []);

  const playWithSound = React.useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    setEnded(false);
    el.muted = false;
    setMuted(false);
    el.play().catch(() => {});
  }, []);

  // Reproducir al primer gesto del usuario en cualquier parte de la página.
  React.useEffect(() => {
    if (!visible || started) return;
    const onFirstGesture = (e: Event) => {
      // Clics dentro de la tarjeta (cerrar/controles) los maneja la tarjeta.
      if (cardRef.current && e.target instanceof Node && cardRef.current.contains(e.target)) {
        return;
      }
      playWithSound();
    };
    const opts: AddEventListenerOptions = { passive: true };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, onFirstGesture, opts));
    return () => events.forEach((ev) => window.removeEventListener(ev, onFirstGesture));
  }, [visible, started, playWithSound]);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
  };

  const replay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.muted = false;
    setMuted(false);
    setEnded(false);
    setStarted(true);
    el.play().catch(() => {});
  };

  return (
    <div
      ref={cardRef}
      className="animate-fade-up fixed bottom-24 right-5 z-40 w-[150px] sm:w-[180px]"
      aria-label="Mensaje en video de HISTECH"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/20 to-[#A855F7]/10 shadow-[0_18px_40px_-12px_rgba(124,58,237,0.45)]">
        <button
          onClick={close}
          aria-label="Cerrar video"
          className="absolute right-1.5 top-1.5 z-10 inline-flex size-6 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
        >
          <X className="size-3.5" />
        </button>

        <video
          ref={videoRef}
          src={MP4_SRC}
          poster={POSTER_SRC}
          className="block aspect-[9/16] w-full cursor-pointer object-cover"
          playsInline
          preload="none"
          onClick={playWithSound}
          onEnded={() => setEnded(true)}
        />

        {/* Estado inicial: pausado con llamada a reproducir */}
        {!started && (
          <button
            onClick={playWithSound}
            aria-label="Reproducir video con sonido"
            className="absolute inset-0 z-[5] grid place-items-center bg-black/25 transition hover:bg-black/15"
          >
            <span className="flex flex-col items-center gap-1.5">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="size-5 translate-x-0.5 fill-[#7C3AED] text-[#7C3AED]" />
              </span>
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                Toca para reproducir
              </span>
            </span>
          </button>
        )}

        {/* Reproduciendo: control de silencio */}
        {started && !ended && (
          <button
            onClick={toggleMute}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
            className="absolute bottom-1.5 left-1.5 z-[5] inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
          >
            {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
          </button>
        )}

        {/* Terminó: repetir */}
        {ended && (
          <button
            onClick={replay}
            aria-label="Repetir video"
            className="absolute inset-0 z-[5] grid place-items-center bg-black/30 transition hover:bg-black/40"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#111827]">
              <RotateCcw className="size-3.5" /> Repetir
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
