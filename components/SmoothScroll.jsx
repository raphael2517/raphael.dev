'use client';

/**
 * SmoothScroll.jsx
 * ─────────────────
 * Initializes Lenis smooth scrolling and syncs it with GSAP's ScrollTrigger.
 *
 * How it works:
 *  1. Lenis intercepts native scroll events and replaces them with smoothly
 *     interpolated values (configurable easing + duration).
 *  2. Every Lenis frame tick calls ScrollTrigger.update() so GSAP always
 *     receives the corrected scroll position — keeping scrub animations
 *     perfectly in sync.
 *  3. We register GSAP's ticker to drive Lenis instead of requestAnimationFrame
 *     directly, so both share the same RAF loop (no double-frames).
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// Expose the Lenis instance globally so other components can use it
export let lenisInstance = null;

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // ── 1. Create Lenis instance ───────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,          // scroll interpolation duration (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;

    // ── 2. Connect Lenis scroll events to ScrollTrigger ───────────────────
    lenis.on('scroll', ScrollTrigger.update);

    // ── 3. Use GSAP ticker to drive Lenis (shared RAF loop) ───────────────
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis expects ms
    });

    // Prevent GSAP from adding its own RAF on top
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup on unmount
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
