'use client';

/**
 * Projects.jsx — Horizontal Pin Scroller
 * ────────────────────────────────────────
 * How the horizontal scroll works:
 *
 * 1. PIN — The section is pinned in place (stops normal page scroll)
 *    while ScrollTrigger accumulates scroll distance.
 *
 * 2. TRANSLATE — The inner track div is translated horizontally by the
 *    accumulated scroll distance: `x: -(trackWidth - viewportWidth)`.
 *    This makes it feel like the cards scroll left as you scroll down.
 *
 * 3. SCRUB — `scrub: 1` means the animation lags 1 second behind scroll,
 *    creating buttery smoothness. Combined with Lenis = heaven.
 *
 * 4. CARD REVEAL — Each card scales from 0.9 → 1 and fades in as it
 *    enters the viewport using a nested ScrollTrigger on the track.
 *
 * 5. DETAIL PAGE LINK — Clicking a card navigates to /projects/[slug]
 *    with a GSAP exit animation (cards slide left, fade out).
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { PROJECTS } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

// ── Individual project card ───────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const cardRef  = useRef(null);
  const imgRef   = useRef(null);
  const router   = useRouter();

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(hover: none)').matches) return;

    // 3D tilt
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const nx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const ny   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      rotX(-ny * 7);
      rotY(nx  * 7);
      card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };

    const onLeave = () => { rotX(0); rotY(0); };

    const onEnter = () => {
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1.07, duration: 0.5, ease: 'power2.out' });
    };
    const onExitHover = () => {
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power2.out' });
      onLeave();
    };

    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onExitHover);
    return () => {
      card.removeEventListener('mousemove',  onMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onExitHover);
    };
  }, []);

  // Navigate to detail page with exit animation
  const handleClick = (e) => {
    e.preventDefault();
    const card = cardRef.current;

    gsap.to(card, {
      scale: 0.95,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => router.push(`/projects/${project.slug}`),
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="project-card flex-shrink-0 w-[280px] md:w-[340px] bg-carbon border border-ash rounded-2xl overflow-hidden cursor-pointer hover:border-acid/30 transition-colors duration-500"
      style={{
        willChange: 'transform',
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
      data-cursor-expand
    >
      {/* Image — 9:16 portrait */}
      <div
        className="relative w-full overflow-hidden bg-ink"
        style={{ aspectRatio: '9 / 16', maxHeight: '300px' }}
      >
        <div ref={imgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
          {project.image ? (
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, #1a1a1a 0%, ${project.color}15 100%)`,
              }}
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-10">
                <circle cx="100" cy="100" r="80" fill="none" stroke={project.color} strokeWidth="0.5"/>
                <circle cx="100" cy="100" r="50" fill="none" stroke={project.color} strokeWidth="0.5"/>
                <line x1="20" y1="100" x2="180" y2="100" stroke={project.color} strokeWidth="0.5"/>
                <line x1="100" y1="20" x2="100" y2="180" stroke={project.color} strokeWidth="0.5"/>
              </svg>
              <span className="font-display text-5xl font-extrabold" style={{ color: `${project.color}30` }}>
                0{project.id}
              </span>
            </div>
          )}
        </div>

        <span className="absolute top-4 right-4 tag bg-void/70 backdrop-blur-sm z-10">{project.year}</span>

        {/* View case study hint */}
        <div className="absolute inset-0 bg-void/0 hover:bg-void/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-400 z-10">
          <span className="font-mono text-xs tracking-widest uppercase text-bone border border-bone/50 px-4 py-2 rounded-full">
            View Case Study →
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-bone text-lg hover:text-acid transition-colors duration-300">
            {project.title}
          </h3>
          <span className="text-xs text-muted font-mono mt-1">↗</span>
        </div>
        <p className="text-muted text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag text-[10px]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Projects Section ──────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    // Wait for layout to settle
    const init = () => {
      // Total scroll distance = track width minus viewport width
      const trackW    = track.scrollWidth;
      const viewportW = window.innerWidth;
      const scrollDist = trackW - viewportW + 96; // 96px padding

      // ── Horizontal pin + scrub ──────────────────────────────────────
      gsap.to(track, {
        x: -scrollDist,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end:   () => `+=${scrollDist + 200}`,
          pin:   true,          // Pin section while we scroll horizontally
          scrub: 1,             // 1s lag for smoothness
          anticipatePin: 1,     // Prevents jump on pin
          invalidateOnRefresh: true,
        },
      });

      // ── Cards fade in as they enter horizontal viewport ─────────────
      const cards = track.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.88 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.001,  // Instant in scrub context
            scrollTrigger: {
              trigger: section,
              start: () => `top top+=${i * 80}`,
              scrub: true,
              containerAnimation: ScrollTrigger.getById('horizontal-scroll'),
            },
          }
        );
      });
    };

    // Small timeout ensures DOM is painted
    const t = setTimeout(init, 100);

    return () => {
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-anchor relative overflow-hidden bg-void"
      style={{ minHeight: '100vh' }}
    >
      {/* Section header — shown above the scrolling track */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 md:px-12 pt-24 md:pt-28 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
        <div>
          <span className="tag mb-3 inline-flex">02 / Work</span>
          <h2
            className="font-display font-extrabold tracking-tighter text-bone leading-none"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            Selected <span className="text-acid">Projects</span>
          </h2>
        </div>
        <p className="text-muted text-sm max-w-xs leading-relaxed">
          Scroll to explore →
        </p>
      </div>

      {/* Horizontal track */}
      <div
        className="flex items-center"
        style={{ height: '100vh', paddingTop: '140px', paddingBottom: '40px' }}
      >
        <div
          ref={trackRef}
          className="flex gap-6 pl-6 md:pl-12 pr-24"
          style={{ willChange: 'transform' }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* End card — link to GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 w-[200px] md:w-[240px] flex flex-col items-center justify-center border border-dashed border-ash rounded-2xl gap-4 hover:border-acid/40 transition-colors duration-300 group"
          >
            <span className="text-3xl text-muted group-hover:text-acid transition-colors duration-300">↗</span>
            <span className="font-mono text-xs tracking-widest uppercase text-muted group-hover:text-bone transition-colors duration-300 text-center">
              More on<br/>GitHub
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
