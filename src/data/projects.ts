import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "gestion-scout-108",
    title: "Gestión Scout 108",
    description:
      "Plataforma de administración para un grupo scout: gestión de miembros y familias, finanzas, calendario de eventos y roles de acceso, todo desde un dashboard centralizado.",
    highlights: [
      "Dashboard con métricas clave y gestión de miembros/familias",
      "Módulo financiero: caja y cuotas, con reportes exportables (Excel/PDF)",
      "Calendario de eventos (FullCalendar) y control de acceso por roles",
      "Angular standalone components + Tailwind/daisyUI, testing con Vitest",
    ],
    tech: ["Angular 21", "TypeScript", "Tailwind CSS", "daisyUI", "FullCalendar", "Vitest"],
    repoUrl: "https://github.com/Bautista-Bevilacqua/gestion-scout-front",
    liveUrl: "https://gestion-scout-front.vercel.app",
    featured: true,
  },
  {
    slug: "f1-temporada-2026",
    title: "F1 Temporada 2026",
    description:
      "Sitio institucional sobre la Fórmula 1, con pilotos, escuderías y circuitos de la temporada 2026. Proyecto final de un curso de desarrollo web, con foco en performance y diseño responsive.",
    highlights: [
      "HTML5 semántico con arquitectura SASS modular (partials, variables, mixins)",
      "Bootstrap 5 customizado con paleta propia (carbon black / rojo F1)",
      "Imágenes en formato AVIF para optimizar performance",
      "Secciones de pilotos, 11 escuderías y 22 circuitos, con formulario de contacto",
    ],
    tech: ["HTML5", "SASS", "Bootstrap 5"],
    repoUrl: "https://github.com/Bautista-Bevilacqua/Coderhouse-DesarrolloWeb-F1",
    featured: true,
  },
  {
    slug: "blog-tecnico",
    title: "Blog Técnico",
    description:
      "Blog técnico desarrollado como proyecto de curso, para publicar artículos y notas sobre desarrollo web.",
    highlights: [],
    tech: ["HTML", "CSS", "JavaScript"],
    repoUrl: "https://github.com/Bautista-Bevilacqua/Mi-blog-tecnico-coderhouse",
    featured: false,
  },
];
