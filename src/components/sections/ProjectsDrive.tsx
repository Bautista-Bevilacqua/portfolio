"use client";

import { useEffect, useRef, useState } from "react";
import { TrackScene } from "@/components/three/TrackScene";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/projects";
import { stationActivation } from "@/lib/track";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function ProjectsDrive() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const finishHintRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent) => setIsCompact(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const count = projects.length;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      scrollProgress.current = p;

      let activeIndex = 0;
      let activeMax = -1;
      for (let i = 0; i < count; i++) {
        const a = stationActivation(p, i, count);
        if (a > activeMax) {
          activeMax = a;
          activeIndex = i;
        }
        const panel = panelRefs.current[i];
        if (panel) {
          panel.style.opacity = String(a);
          panel.style.transform = `translate(-50%, ${(1 - a) * 24}px)`;
          panel.style.pointerEvents = a > 0.6 ? "auto" : "none";
        }
      }

      if (hintRef.current) hintRef.current.style.opacity = String(clamp01(1 - p * 14));
      if (finishHintRef.current) {
        finishHintRef.current.style.opacity = String(clamp01((p - 0.88) / 0.08));
      }
      if (counterRef.current) {
        counterRef.current.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const heightVh = projects.length * 135 + 40;

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      style={{ height: `${heightVh}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <TrackScene
          scrollProgress={scrollProgress}
          count={projects.length}
          isCompact={isCompact}
        />

        {/* Overlay HUD + paneles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-6 top-24 flex items-baseline gap-3">
            <span className="font-mono text-sm text-accent">02</span>
            <span className="text-lg font-semibold tracking-tight">Proyectos</span>
          </div>
          <div className="absolute right-6 top-24 font-mono text-sm text-muted">
            <span ref={counterRef}>01 / 0{projects.length}</span>
          </div>

          <div
            ref={hintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center font-mono text-sm text-muted"
          >
            Scrolleá para recorrer la pista ↓
          </div>

          <div
            ref={finishHintRef}
            style={{ opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center font-mono text-sm text-accent"
          >
            🏁 Cruzaste la meta — seguí bajando para ver los resultados ↓
          </div>

          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{ opacity: 0, transform: "translate(-50%, 24px)" }}
              className="absolute bottom-[8%] left-1/2 w-[min(90vw,32rem)] rounded-lg border border-border bg-surface/85 p-6 backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
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

              <p className="mt-3 text-sm text-muted">{project.description}</p>

              {project.highlights.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-foreground/80">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span className="text-accent">›</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
