import { Container } from "@/components/ui/Container";
import { contact } from "@/data/experience";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <Container className="flex flex-col items-center justify-between gap-2 text-sm text-muted sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Bautista Bevilacqua</p>
        <a href={contact.github} className="font-mono transition-colors hover:text-foreground">
          github.com/Bautista-Bevilacqua
        </a>
      </Container>
    </footer>
  );
}
