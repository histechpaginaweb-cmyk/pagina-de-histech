import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/visuals/aurora";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[80vh] place-items-center overflow-hidden py-32">
      <Aurora />
      <Container className="text-center">
        <p className="font-display text-[7rem] font-bold leading-none text-gradient">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Página no encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          La página que buscas no existe o fue movida. Volvamos a un lugar
          seguro.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Volver al inicio</Button>
          <Button href="/contacto" variant="secondary">
            Contáctanos
          </Button>
        </div>
      </Container>
    </section>
  );
}
