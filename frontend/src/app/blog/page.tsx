import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Aurora } from "@/components/visuals/aurora";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CtaBanner } from "@/components/sections/cta";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata = buildMetadata({
  title: "Blog · Centro de Innovación",
  description:
    "Tendencias, guías y análisis sobre inteligencia artificial, ciberseguridad, cloud y transformación digital para empresas.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-40">
        <Aurora />
        <Container>
          <Breadcrumbs
            items={[
              { name: "Inicio", path: "/" },
              { name: "Blog", path: "/blog" },
            ]}
          />
          <Reveal className="mt-8 max-w-3xl">
            <Badge>Centro de Innovación</Badge>
            <h1 className="mt-5 text-display-xl text-balance">
              <span className="text-gradient">
                Ideas que impulsan la evolución tecnológica
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Tendencias, guías y análisis sobre IA, ciberseguridad, cloud y
              transformación digital.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-6">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Pronto publicaremos nuevos artículos.
            </p>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Reveal>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="card-surface group grid gap-8 overflow-hidden p-8 lg:grid-cols-2 lg:p-10"
                  >
                    <div className="relative hidden min-h-56 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#7C3AED]/20 to-[#A855F7]/15 lg:block">
                      <div className="absolute inset-0 bg-grid opacity-40" />
                      <span className="absolute bottom-4 left-4 eyebrow">
                        {featured.category}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs uppercase tracking-widest text-brand-cyan/80">
                        Destacado
                      </span>
                      <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-muted-foreground">
                        {featured.description}
                      </p>
                      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(featured.date)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {featured.readingTime}
                        </span>
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-cyan">
                        Leer artículo
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <RevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="card-surface group flex h-full flex-col p-7"
                    >
                      <Badge>{p.category}</Badge>
                      <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(p.date)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {p.readingTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </RevealStagger>
              )}
            </>
          )}
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
