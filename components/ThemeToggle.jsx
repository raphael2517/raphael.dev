'use client';

/**
 * ThemeToggle.jsx
 * ────────────────
 * Dark ↔ Light mode toggle with:
 *
 * 1. CIRCULAR WIPE — On toggle, a circle expands from the button's
 *    position using a CSS clip-path animation, revealing the new theme
 *    underneath. This is the smoothest possible theme transition.
 *
 * 2. CSS VARIABLES — The theme is switched by setting `data-theme="light"`
 *    on <html>. All colors are CSS variables, so they update instantly.
 *
 * 3. PERSISTENCE — Theme preference is stored in localStorage so it
 *    survives page refreshes.
 *
 * 4. GSAP ICON ANIMATION — The sun/moon icon morphs between states
 *    with a 180° rotation + scale pulse.
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ThemeToggle() {
  const [isDark, setIsDark]     = useState(true);
  const btnRef                  = useRef(null);
  const rippleRef               = useRef(null);

  // ── Read saved preference on mount ───────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggle = () => {
    const nextDark = !isDark;
    const btn      = btnRef.current;
    const ripple   = rippleRef.current;

    if (!btn || !ripple) return;

    // ── Get button position for ripple origin ─────────────────────────────
    const rect   = btn.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;

    // Diagonal of the screen — ripple needs to reach every corner
    const maxR   = Math.hypot(
      Math.max(cx, window.innerWidth  - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    // Position ripple circle at button center
    ripple.style.left    = `${cx}px`;
    ripple.style.top     = `${cy}px`;
    ripple.style.width   = `${maxR * 2}px`;
    ripple.style.height  = `${maxR * 2}px`;
    ripple.style.background = nextDark ? '#0a0a0a' : '#f5f0e8';

    // ── Animate clip-path: circle(0 → full) ──────────────────────────────
    gsap.fromTo(
      ripple,
      { clipPath: 'circle(0% at 50% 50%)' },
      {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          // Apply theme after ripple covers screen
          document.documentElement.setAttribute(
            'data-theme',
            nextDark ? 'dark' : 'light'
          );
          localStorage.setItem('theme', nextDark ? 'dark' : 'light');
          // Reset ripple (invisible now behind new theme)
          gsap.set(ripple, { clipPath: 'circle(0% at 50% 50%)' });
        },
      }
    );

    // ── Icon spin ─────────────────────────────────────────────────────────
    gsap.to(btn, {
      rotation: '+=180',
      scale: 0.85,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'back.out(2)' }),
    });

    setIsDark(nextDark);
  };

  return (
    <>
      {/* Ripple overlay — sits above everything during transition */}
      <div
        ref={rippleRef}
        className="fixed z-[99990] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ clipPath: 'circle(0% at 50% 50%)', willChange: 'clip-path' }}
      />

      {/* Toggle button */}
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="
          relative w-9 h-9 rounded-full border border-ash
          flex items-center justify-center
          hover:border-acid/60 transition-colors duration-300
          text-muted hover:text-bone
        "
        style={{ willChange: 'transform' }}
      >
        {/* Sun icon (light mode) */}
        {!isDark && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
          </svg>
        )}

        {/* Moon icon (dark mode) */}
        {isDark && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </>
  );
}
