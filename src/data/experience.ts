import type { Certification, ExperienceItem } from "@/types/content";

export const experience: ExperienceItem[] = [
  {
    role: "Full-Stack Developer Intern",
    organization: "Globant",
    period: "2025 — 2026",
    bullets: [
      "Arquitectura de 3 capas (Frontend, BFF, Servicios) integrando Angular, Node.js y Java bajo metodología Scrum",
      "Motor de formularios dinámicos renderizados en tiempo real a partir de configuraciones JSON (Angular Material, Signals/RxJS, Angular CDK)",
      "Capa de orquestación BFF con Express.js: validación de payloads, manejo de sesión y proxy seguro hacia el backend core",
      "Autenticación con Google OAuth2 y JWT; diseño de esquemas relacionales y configuración dinámica en PostgreSQL",
    ],
  },
  {
    role: "Soporte Técnico BUE",
    organization: "Gobierno de la Nación — Elecciones PASO 2023",
    period: "2023",
    bullets: [
      "Instalación, capacitación y mantenimiento de los sistemas de Boleta Única Electrónica",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "Angular de Cero a Experto", issuer: "Udemy — Fernando Herrera", year: "2026" },
  { name: "Node.js de Cero a Experto", issuer: "Udemy — Fernando Herrera", year: "2026" },
  { name: "Desarrollo Web Responsive", issuer: "freeCodeCamp", year: "2024" },
  { name: "Cambridge English First (FCE) — B2", issuer: "Cambridge", year: "2019" },
];

export const skills = {
  frontend: ["Angular 21", "TypeScript", "RxJS", "Angular Material", "Angular CDK", "JavaScript"],
  backend: ["Node.js (Express)", "Java", "Spring Boot", "C# .NET"],
  data: ["PostgreSQL", "SQL Server"],
  arquitectura: ["BFF", "Microservicios", "JWT", "OAuth 2.0", "Git/GitHub"],
};

export const contact = {
  email: "bautistabevilacqua@hotmail.com",
  phone: "+54 11 3627-4155",
  linkedin: "https://linkedin.com/in/bautista-bevilacqua",
  github: "https://github.com/Bautista-Bevilacqua",
  location: "Vicente López, Buenos Aires",
};
