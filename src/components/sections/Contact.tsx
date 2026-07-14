import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact } from "@/data/experience";

export function Contact() {
  return (
    <section id="contacto" className="py-24">
      <Container>
        <SectionHeading eyebrow="04" title="Contacto" />
        <p className="max-w-xl text-lg text-muted">
          ¿Tenés un proyecto en mente o una posición donde pueda sumar? Escribime, con
          gusto lo charlamos.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-md bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            {contact.email}
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-5 py-3 font-medium transition-colors hover:border-accent"
          >
            LinkedIn
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-5 py-3 font-medium transition-colors hover:border-accent"
          >
            GitHub
          </a>
        </div>
      </Container>
    </section>
  );
}
