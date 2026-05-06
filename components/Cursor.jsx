'use client';

/**
 * Cursor.jsx
 * ───────────
 * Custom magnetic cursor with two rings:
 *  - Inner dot: snaps instantly to mouse position
 *  - Outer ring: follows with a springy GSAP lag (gsap.quickTo)
 *
 * On hovering interactive elements (links, buttons, project cards),
 * the outer ring expands and blends — creating a "magnetic" feel.
 *
 * Animation technique: gsap.quickTo() creates optimised setters
 * that avoid re-creating tweens on every mouse move.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    document.body.classList.add('has-custom-cursor');

    // ── Create fast position setters (avoid new tweens each frame) ─────────
    const moveX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

    const moveDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });

    const onMove = (e) => {
      moveX(e.clientX);
      moveY(e.clientY);
      moveDotX(e.clientX);
      moveDotY(e.clientY);
    };

    window.addEventListener('mousemove', onMove);

    // ── Hover states — expand ring on interactive elements ─────────────────
    const hoverables = document.querySelectorAll('a, button, [data-cursor-expand]');

    const onEnter = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.6, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 0,   duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      gsap.to(dot,  { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };

    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // ── Hide/show cursor when leaving/entering window ──────────────────────
    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 }));
    document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 }));

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('has-custom-cursor');
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      >
        <div
          className="w-8 h-8 rounded-full border border-acid"
          style={{ mixBlendMode: 'difference' }}
        />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-acid" />
      </div>
    </>
  );
}
