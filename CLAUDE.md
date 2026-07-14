# Portfolio de Bautista Bevilacqua

Portfolio web personal para conseguir trabajo como programador (full-stack / frontend),
freelance o en relación de dependencia. Único visitante objetivo: reclutadores y clientes
potenciales evaluando si vale la pena contactarlo.

## Quién es Bautista (para tono y contenido)

- Analista en Sistemas, estudiante de 5to año de Ingeniería en Sistemas (UAI, Boulogne).
- Full-Stack Developer Intern en **Globant** (2025–2026): arquitectura de 3 capas
  (Angular + Node.js BFF + Java), motor de formularios dinámicos vía JSON, Angular
  Material/Signals/RxJS/CDK, BFF con Express, OAuth2 + JWT, PostgreSQL.
- Soporte técnico para Elecciones PASO 2023 (Boleta Única Electrónica) — mencionar solo
  brevemente, no es experiencia de dev.
- Stack fuerte: Angular 21, TypeScript, RxJS. También Node/Express, Java/Spring Boot,
  C#/.NET, PostgreSQL/SQL Server, BFF, microservicios, JWT/OAuth2.
- Certificaciones: Angular y Node.js (Udemy, Fernando Herrera), FreeCodeCamp Responsive
  Web Design, Cambridge FCE (inglés B2).
- Contacto real: bautistabevilacqua@hotmail.com · +54 11 3627-4155 ·
  linkedin.com/in/bautista-bevilacqua · github.com/Bautista-Bevilacqua
  (NO usar bbevilacqua@agpruden.com, esa es la cuenta desde la que se opera Claude Code,
  no un dato del CV).
- Le gustan los autos (sobre todo japoneses) y el automovilismo. Esto es un guiño de
  personalidad, **no el tema central** del sitio — ver "Dirección de diseño".

## Proyectos reales a destacar (fuente: github.com/Bautista-Bevilacqua)

Priorizar estos, no generar proyectos ficticios:

1. **Gestión Scout 108** (`gestion-scout-front` + `gestion-scout-api`) — el proyecto más
   robusto. App de administración para un grupo scout: dashboard, gestión de miembros y
   familias, finanzas (caja, cuotas), calendario (FullCalendar), roles de acceso,
   reportes (ExcelJS/jsPDF). Angular 21 standalone components + TypeScript 5.9 +
   Tailwind 4 + daisyUI 5, testing con Vitest. Deploy en Vercel
   (gestion-scout-front.vercel.app). Repo separado de backend (API REST).
2. **F1 Temporada 2026** (`Coderhouse-DesarrolloWeb-F1`) — sitio institucional sobre la
   F1, proyecto final de un curso. HTML5 semántico + SASS modular (partials/variables/
   mixins) + Bootstrap 5 customizado (paleta carbon black / rojo F1), imágenes AVIF,
   pilotos/escuderías/circuitos, form de contacto. Este es el que conecta directamente
   con el interés por el automovilismo — buen candidato para mostrar con capturas.
3. **Mi blog técnico** (`Mi-blog-tecnico-coderhouse`) — blog técnico, proyecto de curso.
4. `PracticasReact` y `Proyectos-FreeCodeCamp` — ejercicios de práctica/aprendizaje, NO
   mostrar como proyectos destacados; como mucho una línea en una sección de "trayectoria
   de aprendizaje" si hace falta rellenar.
5. `te-hago-la-pata-web` — es solo un boilerplate de create-next-app sin desarrollo real,
   ignorar.

Los datos curados de estos proyectos viven en `src/data/projects.ts`. Cuando haya nueva
info (capturas, más detalle) actualizar ahí, no hardcodear en los componentes.

## Dirección de diseño (decidida con el usuario, no reabrir la discusión sin motivo)

- **3D nivel intermedio, foco en interactividad**: no hace falta un modelo 3D complejo
  (no tiene que ser literalmente un auto). Priorizar que reaccione al mouse y al scroll
  por sobre el detalle del modelo/escena.
- **Estética**: guiño sutil a autos/racing (acentos tipo tacómetro, alguna tipografía o
  micro-detalle con espíritu racing, paleta que puede tomar prestado algo de carbon
  black / rojo), pero el foco visual y narrativo sigue siendo el trabajo como
  programador. Si en algún momento el diseño empieza a "gritar sitio de autos", frenar.
- Dark mode como base (encaja con la estética y es estándar en portfolios dev).
- Mobile-first: un reclutador puede abrir el link desde el celular; nada de escenas 3D
  que tranquen en mobile. Usar `@react-three/drei`'s `<Preload>`/lazy loading y
  degradar/simplificar la escena 3D en viewports chicos en vez de ocultarla del todo.

## Stack

- **Next.js 16 (App Router) + TypeScript**, `src/` dir, alias `@/*`.
  - ⚠️ Next 16 es posterior al training data del modelo — antes de usar una API o
    convención de la que no estés seguro, revisar `node_modules/next/dist/docs/`
    (estructura: `01-app/01-getting-started`, `03-api-reference`, etc.) en vez de asumir
    por memoria de versiones anteriores.
- **Tailwind CSS 4** (config en `postcss.config.mjs`, sin `tailwind.config.js` clásico —
  Tailwind 4 usa CSS-first config vía `@theme` en `globals.css`).
- **React Three Fiber (`@react-three/fiber`) + `@react-three/drei`** para el 3D.
  Todo componente que use R3F/hooks de navegador necesita `"use client"`.
- **Framer Motion** para animaciones que no son 3D (scroll reveals, transiciones).
- **Deploy: Vercel** (integración directa con GitHub, previews por PR).
- Datos de proyectos como contenido curado a mano (`src/data/projects.ts`), no vía
  llamada en vivo a la API de GitHub (evita rate limits y permite curar descripciones).

## Estructura de carpetas

```
src/
  app/                 # rutas (App Router), layout.tsx, page.tsx, globals.css
  components/
    layout/            # navbar, footer, contenedores de página
    sections/          # Hero, About, Projects, Experience, Contact
    three/             # componentes R3F ("use client"), escenas, controles de cámara
    ui/                 # botones, cards, badges reutilizables
  data/                # projects.ts, experience.ts (contenido curado, tipado)
  lib/                 # utilidades (ej. helpers de animación, hooks compartidos)
  types/               # tipos compartidos (Project, ExperienceItem, etc.)
```

## Convenciones

- Componentes de sección en `components/sections/` son Server Components salvo que
  necesiten interactividad (animaciones con hooks, R3F) — en ese caso `"use client"`
  en el componente más chico posible, no en toda la sección.
- Sin backend propio por ahora: sitio estático/SSG. Si en el futuro se agrega un form de
  contacto funcional, evaluar Route Handler (`src/app/api/.../route.ts`) + algún
  proveedor de email (Resend, etc.) — no antes de que se pida explícitamente.
- Sin comentarios explicativos de "qué hace" el código (los nombres ya lo dicen). Solo
  comentar decisiones no obvias (ej. por qué se simplifica la escena 3D en mobile).

## Notas sobre el 3D (aprendidas, no reabrir a ciegas)

- La escena del hero vive en `src/components/three/`: `HeroScene` (Canvas + rigs de
  cámara/scroll), `GridFloor` (piso de grilla en perspectiva vía shader, el elemento
  racing más visible), `InteractiveCore` (icosaedro emisivo + wireframe que sigue el
  mouse y pulsa). Interactividad: parallax de cámara con el mouse y dolly/tilt + avance
  de la grilla con el scroll.
- **Quirk de inicialización**: R3F dimensiona el canvas cuando su observer reporta
  tamaño; en algunos entornos el primer callback no dispara al montar y el canvas queda
  en 300x150 (nada visible). Hay un workaround en `HeroScene` que dispara `resize`
  sintéticos escalonados al montar. No quitarlo salvo que se confirme que ya no hace
  falta.
- **Verificación visual**: el navegador de preview del entorno de desarrollo NO puede
  leer la salida WebGL (screenshots hacen timeout, `readPixels`/`drawImage` devuelven
  vacío). Eso NO significa que la escena esté en blanco — es una limitación del sandbox.
  Para juzgar el resultado 3D hay que abrirlo en un navegador real (`npm run dev` →
  localhost:3000). Sí se puede verificar por consola: que el canvas se dimensione
  (`canvas.width > 300`) y que no haya errores/errores de shader.
- `preserveDrawingBuffer: true` está puesto en el `gl` del Canvas (ayuda a que el canvas
  sea capturable). Si hace falta exprimir performance en el futuro, se puede evaluar
  sacarlo.
- El mouse-follow usa `state.pointer` (R3F), que ya viene normalizado -1..1.

## Sección de Proyectos = recorrido 3D en primera persona (feature grande)

Decisión del usuario: la sección de proyectos NO es scroll normal, es un recorrido
manejando en primera persona por una pista de carreras; se frena en cada proyecto y
aparece su descripción. Confirmado: 3D en TODOS los dispositivos (en mobile se simplifica
la geometría, no se cae a cards). El texto de cada proyecto vive en el DOM (paneles HTML)
para SEO/accesibilidad.

Arquitectura:
- `src/lib/track.ts` — pura lógica, sin React. `createTrackCurve()` (CatmullRomCurve3 que
  avanza en -Z con curvas), `buildRoadGeometry()` (cinta de asfalto con uv para el shader),
  `makeProgressToT()` (mapea scroll 0..1 → t de la curva con MESETAS alrededor de cada
  estación = el frenado), `stationActivation()` (0..1 por proyecto, para el fade del panel).
- `src/components/sections/ProjectsDrive.tsx` — sección ALTA (`height: n*135vh+40`) con un
  hijo `sticky top-0 h-screen`. Un listener de scroll (throttle con rAF) calcula el
  progreso desde `getBoundingClientRect()` de la sección y actualiza cámara (vía ref) y
  paneles (vía refs, sin re-render de React). Los paneles HTML se hacen fade-in al frenar.
- `src/components/three/TrackScene.tsx` — Canvas + `CameraRig` (primera persona: posición
  = punto de la curva + altura de ojos, mira hacia la tangente → las curvas se sienten).
  Incluye `ResizeKick` (mismo workaround del quirk de ResizeObserver).
- `Road.tsx` (shader: asfalto + bordes + línea central discontinua que corre), `Gates.tsx`
  (pórticos checkpoint por estación), `TrackMarkers.tsx` (postes reflectores laterales
  con InstancedMesh, dan sensación de velocidad; se ocultan en mobile).

Verificación hecha: tsc + lint limpios; ambos canvas (hero + pista) inicializan; sin
errores de shader/consola; la lógica scroll→t→paneles validada numéricamente (velocidad
~0 en cada estación, ~9.5 entre estaciones; activación de paneles pico 1.0 justo en cada
proyecto). Falta: prueba de manejo real del usuario para ajustar el FEEL (velocidad,
cuánto frena, agresividad de curvas, fov).

## Limitación de verificación del entorno (importante)

La pestaña del navegador de preview corre OCULTA (`document.hidden === true`), así que el
navegador PAUSA `requestAnimationFrame`. Consecuencia: NO corren ni el render de R3F ni
los handlers de scroll basados en rAF, y los screenshots/lecturas de píxeles WebGL vuelven
vacíos. Esto NO indica bugs. Para verificar acá: usar `setTimeout` (no rAF), chequear que
los canvas se dimensionen, revisar consola/errores de shader, y validar lógica llamando
funciones puras. El juicio visual/interactivo lo hace el usuario en su navegador real.

## Estado del proyecto

Scaffold + secciones (Hero, Sobre mí, Proyectos, Experiencia, Contacto) + hero 3D
interactivo funcionando. Pendiente: revisión visual del 3D por el usuario en navegador
real, capturas de proyectos, crear repo + deploy a Vercel, primer commit.
