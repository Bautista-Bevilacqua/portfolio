import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { experience, certifications } from "@/data/experience";

export function Experience() {
  return (
    <section id="experiencia" className="py-24">
      <Container>
        <SectionHeading eyebrow="03" title="Experiencia" />

        <div className="flex flex-col gap-10">
          {experience.map((item) => (
            <div key={item.role} className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:gap-8">
              <div>
                <h3 className="font-semibold">{item.role}</h3>
                <p className="text-sm text-accent">{item.organization}</p>
                <p className="font-mono text-xs text-muted">{item.period}</p>
              </div>
              <ul className="flex flex-col gap-1.5 text-sm text-foreground/80">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-accent">›</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
            Certificaciones
          </h3>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Badge key={cert.name}>
                {cert.name} · {cert.year}
              </Badge>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
