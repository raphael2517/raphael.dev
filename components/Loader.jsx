'use client';

/**
 * Loader.jsx
 * ───────────
 * Full-screen preloader that:
 *
 * 1. COUNTER — Anime.js counts a number from 0 → 100 with an
 *    exponential ease (slow start, fast finish). Duration ~1.8s.
 *
 * 2. WIPE OUT — Once counter hits 100, two panels (top + bottom)
 *    slide away in opposite directions using GSAP, revealing the site.
 *    The wipe uses `scaleY` on panels anchored at opposite edges.
 *
 * 3. UNMOUNT — After the wipe completes, `onComplete()` is called
 *    which removes the loader from the DOM entirely.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef  = useRef(null);
  const topRef     = useRef(null);
  const bottomRef  = useRef(null);
  const counterRef = useRef(null);
  const nameRef    = useRef(null);

  useEffect(() => {
    // ── 1. Animate name letters in ────────────────────────────────────────
    const letters = nameRef.current?.querySelectorAll('.loader-char');
    gsap.fromTo(
      letters,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    );

    // ── 2. Anime.js counter 0 → 100 ───────────────────────────────────────
    import('animejs').then(({ default: anime }) => {
      const obj = { value: 0 };

      anime({
        targets: obj,
        value: 100,
        duration: 1800,
        easing: 'easeInOutExpo',
        update: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(obj.value)).padStart(3, '0');
          }
        },
        complete: () => {
          // ── 3. Wipe panels out ─────────────────────────────────────────
          const tl = gsap.timeline({
            onComplete: () => onComplete?.(),
          });

          tl.to(counterRef.current, { opacity: 0, duration: 0.2 })
            .to(nameRef.current,    { opacity: 0, duration: 0.2 }, '<')
            .to(topRef.current, {
                scaleY: 0,
                duration: 0.8,
                ease: 'power4.inOut',
                transformOrigin: 'top',
              }, '+=0.05')
            .to(bottomRef.current, {
                scaleY: 0,
                duration: 0.8,
                ease: 'power4.inOut',
                transformOrigin: 'bottom',
              }, '<0.05');
        },
      });
    });
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[99999] pointer-events-none">

      {/* Top panel */}
      <div
        ref={topRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-void flex items-end justify-between px-8 md:px-12 pb-4"
        style={{ transformOrigin: 'top', willChange: 'transform' }}
      >
        {/* Site name — split chars */}
        <div ref={nameRef} className="flex gap-1" aria-label="RAPHAEL">
          {'RAPHAEL'.split('').map((c, i) => (
            <span
              key={i}
              className="loader-char font-display font-extrabold text-bone leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <span className="font-mono text-xs text-muted uppercase tracking-widest hidden md:block">
          Loading experience
        </span>
      </div>

      {/* Bottom panel */}
      <div
        ref={bottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-void flex items-start justify-between px-8 md:px-12 pt-4"
        style={{ transformOrigin: 'bottom', willChange: 'transform' }}
      >
        {/* Counter */}
        <span
          ref={counterRef}
          className="font-display font-extrabold text-acid tabular-nums"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          000
        </span>

        <span className="font-mono text-xs text-muted uppercase tracking-widest self-center hidden md:block">
          Creative Developer
        </span>
      </div>

      {/* Center divider line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-ash -translate-y-1/2" />
    </div>
  );
}
