import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/data/experience";

const skillGroups = [
  { label: "Frontend", items: skills.frontend },
  { label: "Backend", items: skills.backend },
  { label: "Datos", items: skills.data },
  { label: "Arquitectura", items: skills.arquitectura },
];

export function About() {
  return (
    <section id="sobre-mi" className="py-24">
      <Container>
        <SectionHeading eyebrow="01" title="Sobre mí" />
        <div className="grid gap-12 sm:grid-cols-2">
          <p className="text-balance text-lg leading-relaxed text-muted">
            Analista en Sistemas y estudiante avanzado de Ingeniería en Sistemas de la
            Información (UAI). Desarrollador full-stack con experiencia en arquitecturas
            modernas — microservicios y BFF — en entornos corporativos, especializado en
            Angular y Node.js para construir aplicaciones escalables y seguras.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-1 text-sm text-foreground/80">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
