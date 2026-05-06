'use client';

/**
 * Hero.jsx
 * ─────────
 * Full-viewport hero with:
 *
 * 1. TEXT REVEAL — Each character of the main heading is wrapped in an
 *    overflow-hidden span so it clips during the translateY animation,
 *    creating a "rising from below" reveal. GSAP staggers each character
 *    with a 0.03s delay.
 *
 * 2. PARALLAX — The heading and subtitle translate at different speeds as
 *    you scroll down (scrub:true), layering depth via ScrollTrigger.
 *
 * 3. ANIMATED MARQUEE — A horizontal ticker at the bottom, infinite loop
 *    using Anime.js (lightweight for this small interaction).
 *
 * 4. FLOATING BLOBS — Two radial-gradient blobs drift slowly via GSAP
 *    keyframes, giving a subtle ambient glow.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Split a string into individual char spans for animation
function splitChars(text, className = '') {
  return text.split('').map((char, i) => (
    <span key={i} className="char-wrap" aria-hidden="true">
      <span className={`char-inner ${className}`} data-char={char}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));
}

export default function Hero() {
  const sectionRef  = useRef(null);
  const headRef     = useRef(null);
  const subRef      = useRef(null);
  const scrollHintRef = useRef(null);
  const blob1Ref    = useRef(null);
  const blob2Ref    = useRef(null);
  const marqueeRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const chars   = section.querySelectorAll('.char-inner');
    const subEls  = section.querySelectorAll('.sub-el');

    // ── 1. Initial character reveal on load ──────────────────────────────
    // Characters start below their clip container (translateY: 110%)
    // and animate up. Stagger creates the wave effect.
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.set(chars, { y: '110%' })
      .to(chars, {
        y: '0%',
        duration: 1.1,
        stagger: 0.03,    // 30ms between each character
        delay: 0.2,
      })
      .fromTo(
        subEls,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.6'           // overlap with char animation
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      );

    // ── 2. Floating ambient blobs ─────────────────────────────────────────
    // GSAP keyframes for organic, looping movement
    gsap.to(blob1Ref.current, {
      keyframes: [
        { x: 40,  y: -30, duration: 4 },
        { x: -20, y: 40,  duration: 5 },
        { x: 0,   y: 0,   duration: 4 },
      ],
      repeat: -1,
      yoyo: false,
      ease: 'sine.inOut',
    });

    gsap.to(blob2Ref.current, {
      keyframes: [
        { x: -50, y: 20,  duration: 5 },
        { x: 30,  y: -40, duration: 4 },
        { x: 0,   y: 0,   duration: 5 },
      ],
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.5,
    });

    // ── 3. Parallax on scroll ─────────────────────────────────────────────
    // The heading moves up slower than scroll (0.3× speed) — depth illusion
    gsap.to(headRef.current, {
      y: -120,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,       // scrub value = lag in seconds (smoother)
      },
    });

    gsap.to(subRef.current, {
      y: -60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
    });

    // ── 4. Marquee ticker (Anime.js) ──────────────────────────────────────
    // We duplicate the content so the loop is seamless
    const marquee = marqueeRef.current;
    if (marquee) {
      let pos = 0;
      const speed = 0.4; // px per frame
      const width = marquee.scrollWidth / 2;

      const tick = () => {
        pos -= speed;
        if (Math.abs(pos) >= width) pos = 0;
        marquee.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(tick);
      };
      const rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }
  }, []);

  const MARQUEE_ITEMS = [
    'Next.js', '·', 'React', '·', 'TypeScript', '·', 'GSAP', '·',
    'Figma', '·', 'Node.js', '·', 'Tailwind CSS', '·', 'Three.js', '·',
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── Ambient blobs ──────────────────────────────────────────────── */}
      <div
        ref={blob1Ref}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,255,71,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,255,71,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          willChange: 'transform',
        }}
      />

      {/* ── Vertical grid lines ────────────────────────────────────────── */}
      <div className="grid-line grid-line-v left-[8%]  opacity-20" />
      <div className="grid-line grid-line-v right-[8%] opacity-20" />

      {/* ── Main heading ───────────────────────────────────────────────── */}
      <div ref={headRef} className="px-6 md:px-12 pt-24 md:pt-32" style={{ willChange: 'transform' }}>
        {/* Eyebrow label */}
        <p className="sub-el font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
          Creative Developer &amp; Designer
        </p>

        {/* Giant display name — chars split for animation */}
        <h1
          className="font-display font-extrabold leading-none tracking-tightest text-bone"
          style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
          aria-label="RAPHAEL"
        >
          {splitChars('RAPHAEL')}
        </h1>

        {/* aka line */}
        <div className="flex items-baseline gap-4 mt-2 md:mt-4">
          <span
            className="font-mono text-muted text-sm tracking-widest sub-el"
          >
            ─ aka
          </span>
          <h2
            className="font-display font-bold text-acid tracking-tightest"
            style={{ fontSize: 'clamp(2rem, 6vw, 5.5rem)' }}
            aria-label="SUYASH"
          >
            {splitChars('SUYASH')}
          </h2>
        </div>
      </div>

      {/* ── Subtitle + CTA ─────────────────────────────────────────────── */}
      <div ref={subRef} className="px-6 md:px-12 mt-12 md:mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <p className="sub-el max-w-sm text-muted font-body text-lg leading-relaxed">
          I craft digital experiences that live at the intersection of{' '}
          <span className="text-bone">design</span> and{' '}
          <span className="text-bone">engineering</span>.
        </p>

        <div className="sub-el flex items-center gap-6">
          <a
            href="#projects"
            className="group flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-bone hover:text-acid transition-colors duration-300"
          >
            <span className="w-8 h-px bg-current transition-all duration-500 group-hover:w-16" />
            View Work
          </a>

          <a
            href="#contact"
            className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 border border-ash rounded-full text-muted hover:text-bone hover:border-acid transition-all duration-300"
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* ── Scroll hint ────────────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-widest text-muted uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-muted to-transparent" />
      </div>

      {/* ── Marquee ticker ─────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-ash/30 py-3 bg-ink/40 backdrop-blur-sm">
        <div
          ref={marqueeRef}
          className="flex gap-6 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {/* Render items twice for seamless loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`font-mono text-xs tracking-widest uppercase ${
                item === '·' ? 'text-acid' : 'text-muted'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
