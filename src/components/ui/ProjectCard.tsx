import type { Project } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent/60">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <div className="flex shrink-0 gap-3 font-mono text-xs text-muted">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            repo
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              demo
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-muted">{project.description}</p>

      {project.highlights.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-sm text-foreground/80">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="text-accent">›</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {project.tech.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </article>
  );
}
