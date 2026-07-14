import { Container } from "@/components/ui/Container";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/60 via-40% to-transparent" />

      <Container className="relative z-10">
        <p className="font-mono text-sm text-accent">Desarrollador Full Stack</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Bautista Bevilacqua
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Construyo aplicaciones web escalables con Angular y Node.js — de la interfaz al
          backend, con foco en arquitectura y detalle.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#proyectos"
            className="rounded-md bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Ver proyectos
          </a>
          <a
            href="#contacto"
            className="rounded-md border border-border px-5 py-3 font-medium transition-colors hover:border-accent"
          >
            Contactarme
          </a>
        </div>
      </Container>
    </section>
  );
}
