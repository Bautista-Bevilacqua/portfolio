import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section id="proyectos" className="py-24">
      <Container>
        <SectionHeading eyebrow="02" title="Proyectos" />
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {rest.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-4 font-mono text-sm text-muted">
            {rest.map((project) => (
              <li key={project.slug}>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {project.title} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
