'use client';
import Image from 'next/image';

/**
 * About.jsx
 * ──────────
 * Scroll-triggered section with:
 *
 * 1. SECTION LABEL — Small tag slides in from left on scroll
 * 2. HEADING — Two lines fade + translate Y with stagger (ScrollTrigger)
 * 3. BODY TEXT — Paragraph lines reveal word-by-word using a clip mask
 * 4. STAT COUNTERS — Numbers count up when the section enters viewport
 * 5. IMAGE PLACEHOLDER — Slides in from right with a slight rotation
 *
 * All animations use "start: top 75%" so they trigger slightly before
 * the element reaches center, giving a natural feel.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '3+',  label: 'Years experience'  },
  { value: '20+', label: 'Projects shipped'  },
  { value: '∞',   label: 'Curiosity'         },
];

export default function About() {
  const sectionRef = useRef(null);
  const imgRef     = useRef(null);
  const headRef    = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // ── 1. Section heading reveal ─────────────────────────────────────────
    // Each line of the heading fades in and slides up from 40px below
    gsap.fromTo(
      section.querySelectorAll('.about-head-line'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headRef.current,
          start: 'top 80%',
        },
      }
    );

    // ── 2. Left column content fade in ────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.about-content'),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );

    // ── 3. Image slide in from right ──────────────────────────────────────
    // Slight rotation for dynamism, resolves to 0 on scroll
    gsap.fromTo(
      imgRef.current,
      { x: 80, opacity: 0, rotation: 3 },
      {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imgRef.current,
          start: 'top 80%',
        },
      }
    );

    // ── 4. Stat counters — count up when in view ──────────────────────────
    // We use IntersectionObserver for a one-shot count-up, separate from ScrollTrigger
    const statEls = section.querySelectorAll('.stat-value');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            gsap.fromTo(
              el,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }
            );
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach((el) => observer.observe(el));

    // ── 5. Horizontal rule line draw ──────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.draw-line'),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      }
    );

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-anchor py-28 md:py-40 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Grid decoration */}
      <div className="grid-line grid-line-h top-0 draw-line origin-left" />

      {/* Section eyebrow */}
      <div className="about-content flex items-center gap-4 mb-12 md:mb-20">
        <span className="tag">01 / About</span>
        <div className="h-px flex-1 max-w-[60px] bg-ash draw-line origin-left" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

        {/* ── Left — Text ──────────────────────────────────────────────── */}
        <div>
          {/* Heading */}
          <div ref={headRef} className="mb-10 overflow-hidden">
            <p
              className="about-head-line font-display font-bold leading-tight tracking-tighter text-bone"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Crafting with
            </p>
            <p
              className="about-head-line font-display font-bold leading-tight tracking-tighter"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              <span className="text-acid">code &</span>{' '}
              <span className="text-bone">purpose.</span>
            </p>
          </div>

          {/* Bio paragraphs */}
          <div className="space-y-5 max-w-md">
            <p className="about-content text-muted leading-relaxed text-base">
              I'm Raphael — a builder who lives deep in Linux, systems, and code. I spend most of my time
              understanding how things actually work under the hood, from system behavior to network flow,
              and turning that knowledge into real-world projects.
            </p>
            <p className="about-content text-muted leading-relaxed text-base">
              I’m into game development, cybersecurity, and low-level problem solving — whether it’s crafting
              immersive worlds in Godot, monitoring systems, or experimenting with ideas that sit somewhere
              between logic and imagination. I don’t just use tech, I try to understand it completely.
            </p>
          </div>

          {/* Download CV */}
          <a
            href="/cv.pdf"
            className="about-content inline-flex items-center gap-3 mt-10 font-mono text-xs uppercase tracking-widest text-acid hover:gap-5 transition-all duration-300"
          >
            Download CV
            <span className="text-lg leading-none">↓</span>
          </a>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="about-content">
                <p
                  className="stat-value font-display font-extrabold text-bone"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                >
                  {value}
                </p>
                <p className="font-mono text-xs text-muted tracking-wider mt-1 uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — Profile image ─────────────────────────────────────── */}
        <div ref={imgRef} className="relative" style={{ willChange: 'transform' }}>
          {/* 9:16 portrait placeholder */}
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-carbon border border-ash"
            style={{ aspectRatio: '4/3', maxHeight: '420px' }}
          >
            {/* Placeholder gradient — replace with <Image> from next/image */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #111 50%, #0d0d0d 100%)',
              }}
            />
            {/* Decorative corner accent */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-acid opacity-60" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-acid opacity-60" />

            <Image
            src="/profile.jpg"
            alt="Raphael aka Suyash"
            fill
            className="object-cover object-center"
            priority
          />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-acid/0 hover:bg-acid/5 transition-colors duration-500" />
          </div>

          {/* Floating label badge */}
          <div className="absolute -bottom-4 -left-4 bg-acid text-void font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full shadow-xl">
            Available for hire ✦
          </div>
        </div>
      </div>

      <div className="grid-line grid-line-h bottom-0 draw-line origin-left" />
    </section>
  );
}
