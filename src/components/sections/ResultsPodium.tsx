import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Container } from "@/components/ui/Container";

const CHECKER =
  "repeating-conic-gradient(#e6e6ea 0deg 90deg, #101014 90deg 180deg) 0 0 / 16px 16px";

// Layout de podio: P2 a la izquierda, P1 al centro (más alto), P3 a la derecha.
const PODIUM = [
  { rank: 2, index: 1, barClass: "h-24 sm:h-28" },
  { rank: 1, index: 0, barClass: "h-32 sm:h-40" },
  { rank: 3, index: 2, barClass: "h-16 sm:h-20" },
];

export function ResultsPodium() {
  const podium = PODIUM.filter((slot) => projects[slot.index]);

  return (
    <section id="resultados" className="relative border-t border-border py-24">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2 opacity-70"
        style={{ background: CHECKER }}
      />

      <Container>
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-sm tracking-widest text-accent">
            🏁 META
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Clasificación final
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Cruzaste la línea de meta. Acá están todos los proyectos del recorrido,
            para verlos con calma.
          </p>
        </div>

        <div className="mt-14 flex items-end justify-center gap-3 sm:gap-6">
          {podium.map((slot) => {
            const project = projects[slot.index];
            const isWinner = slot.rank === 1;
            return (
              <div key={project.slug} className="flex flex-1 flex-col items-center gap-3 sm:max-w-[12rem]">
                <span className="text-center text-sm font-semibold leading-tight">
                  {project.title}
                </span>
                <div
                  className={`${slot.barClass} flex w-full items-start justify-center rounded-t-md border-x border-t ${
                    isWinner
                      ? "border-accent/50 bg-gradient-to-b from-accent/40 to-accent/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <span
                    className={`mt-3 font-mono text-2xl font-bold sm:text-3xl ${
                      isWinner ? "text-accent" : "text-muted"
                    }`}
                  >
                    P{slot.rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div
          aria-hidden
          className="mx-auto h-1 w-full max-w-2xl"
          style={{ background: CHECKER }}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
