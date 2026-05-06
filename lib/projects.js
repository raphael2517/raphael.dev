/**
 * lib/projects.js
 * ────────────────
 * Single source of truth for all project data.
 * Used by:  Projects.jsx (horizontal scroller cards)
 *           app/projects/[slug]/page.js (detail pages)
 *
 * HOW TO ADD A NEW PROJECT:
 *   1. Add an object to the PROJECTS array below
 *   2. Drop your 9:16 cover image in /public/projects/
 *   3. Add any extra screenshots to the `gallery` array
 *   That's it — the card and detail page are auto-generated.
 */

export const PROJECTS = [
  {
    id: 1,
    slug: 'luminary',
    title: 'Luminary',
    tagline: 'Where algorithms meet aesthetics',
    description:
      'A generative art platform where algorithms meet aesthetics. Real-time canvas rendering with WebGL shaders.',
    fullDescription: `Luminary started as a weekend experiment — could I make generative art that
      felt alive and personal? Six months later it became a platform used by 2,000+ artists.
      
      The core challenge was performance: running GLSL shaders at 60fps while streaming live
      parameter changes over WebSockets. I solved this by decoupling the render loop from the
      UI thread using OffscreenCanvas and a dedicated Worker.`,
    tags: ['Next.js', 'WebGL', 'GLSL', 'Framer'],
    image: null,           // e.g. '/projects/luminary.jpg'
    gallery: [null, null, null],  // additional screenshots
    href: '#',
    github: 'https://github.com',
    year: '2024',
    role: 'Solo — Design + Engineering',
    duration: '6 months',
    featured: true,
    color: '#c8ff47',      // accent color for detail page header
  },
  {
    id: 2,
    slug: 'orbit-cms',
    title: 'Orbit CMS',
    tagline: 'Headless CMS built for speed',
    description:
      'Headless CMS with a drag-and-drop editor, built for speed and flexibility.',
    fullDescription: `Orbit was born from frustration with existing CMSes being either too opinionated
      or too complex. The goal: a CMS that developers actually enjoy using.
      
      The editor is built on ProseMirror with custom block nodes, and the API is tRPC
      giving end-to-end type safety from database to component.`,
    tags: ['React', 'Node.js', 'Postgres', 'tRPC'],
    image: null,
    gallery: [null, null],
    href: '#',
    github: 'https://github.com',
    year: '2024',
    role: 'Lead Developer',
    duration: '4 months',
    featured: false,
    color: '#47c8ff',
  },
  {
    id: 3,
    slug: 'neon-dash',
    title: 'Neon Dash',
    tagline: 'Infinite runner, browser-native',
    description:
      'Infinite runner game built entirely in the browser using Canvas2D and vanilla JS.',
    fullDescription: `A love letter to retro arcade games, built without any game engine.
      Everything — physics, collision, rendering, sound — is hand-rolled in ~800 lines of JS.
      
      The biggest technical win was implementing a spatial hash grid for collision detection,
      dropping CPU usage from 40% to 4% at peak enemy density.`,
    tags: ['Canvas2D', 'Vanilla JS', 'Howler.js', 'Web Workers'],
    image: null,
    gallery: [null, null],
    href: '#',
    github: 'https://github.com',
    year: '2023',
    role: 'Solo project',
    duration: '3 weeks',
    featured: false,
    color: '#ff47c8',
  },
  {
    id: 4,
    slug: 'void-radio',
    title: 'Void Radio',
    tagline: 'Ambient streaming with a visualizer',
    description:
      'Ambient streaming app with visualizer. Lo-fi beats to study to.',
    fullDescription: `Void Radio is a curated ambient music player with a real-time frequency
      visualizer built on the Web Audio API. The visualizer uses an AnalyserNode to extract
      FFT data and maps it to a polar coordinate system drawn on Canvas.
      
      The stream is a custom Icecast server running on a $5 VPS.`,
    tags: ['React', 'Web Audio API', 'Lottie', 'Icecast'],
    image: null,
    gallery: [null],
    href: '#',
    github: 'https://github.com',
    year: '2023',
    role: 'Design + Development',
    duration: '2 months',
    featured: false,
    color: '#ff8c47',
  },
];

/** Get a project by its URL slug */
export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}

/** Get prev/next projects for navigation on detail pages */
export function getAdjacentProjects(slug) {
  const idx  = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[idx - 1] || PROJECTS[PROJECTS.length - 1];
  const next = PROJECTS[idx + 1] || PROJECTS[0];
  return { prev, next };
}
