import { Container } from "@/components/ui/Container";

const links = [
  { href: "#proyectos", label: "Proyectos" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">
          bautista<span className="text-accent">.dev</span>
        </a>
        <nav className="flex items-center gap-6 text-sm text-muted">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
