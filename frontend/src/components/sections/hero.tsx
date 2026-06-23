import { LogoImage } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site";

const HIGHLIGHT = "eficiencia y conectividad";

export function Hero() {
  const [titlePre, titlePost] = siteConfig.hero.title.split(HIGHLIGHT);

  return (
    <section className="relative isolate overflow-hidden bg-white pb-4 pt-20 sm:pt-24 lg:pb-3 lg:pt-20">
      {/* ── Fondo claro (full-bleed, sin oscurecer) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg-light.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />
      {/* Glows morados decorativos muy suaves */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 -z-20 h-[34rem] w-[34rem] rounded-full bg-[#A855F7]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-1/3 -z-20 h-[28rem] w-[28rem] rounded-full bg-[#7C3AED]/10 blur-3xl"
      />

      <div className="container">
        {/* ── 2 columnas: texto (45%) + ilustración (55%) ── */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[45fr_55fr] lg:items-start lg:gap-8">
          {/* Columna izquierda — contenido */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Logo HISTECH */}
            <div className="mb-8 w-full max-w-[317px] animate-fade-up sm:max-w-[342px] lg:mb-10">
              <LogoImage priority className="w-full" />
            </div>

            {/* Headline */}
            <h1 className="mt-2 max-w-full text-[1.365rem] font-extrabold leading-[1.08] tracking-tight text-[#111827] animate-fade-up [animation-delay:80ms] sm:text-[1.91rem] lg:max-w-[580px] lg:text-[2.31rem] lg:leading-[1.05]">
              {titlePre}
              <span>{HIGHLIGHT}</span>
              {titlePost}
            </h1>

            {/* Descripción */}
            <p className="mt-6 max-w-full text-base leading-relaxed text-[#4B5563] text-pretty animate-fade-up [animation-delay:160ms] sm:text-lg lg:max-w-[650px]">
              {siteConfig.hero.subtitle}
            </p>
          </div>

          {/* Columna derecha — ilustración del ecosistema */}
          <div className="animate-fade-up [animation-delay:200ms]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-objects.webp"
              alt="Ecosistema tecnológico HISTECH: Cloud conectada con Infraestructura, Ciberseguridad, Redes, DevOps e Inteligencia Artificial"
              width={860}
              height={572}
              decoding="async"
              loading="eager"
              className="mx-auto h-auto w-full max-w-[560px] select-none mix-blend-multiply animate-float-soft lg:max-w-[680px] xl:max-w-[760px]"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
