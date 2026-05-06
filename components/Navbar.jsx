'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenisInstance } from './SmoothScroll';
import ThemeToggle from './ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Contact',  href: '#contact'  },
];

export default function Navbar() {
  const navRef      = useRef(null);
  const progressRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.4 } // after loader
    );

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { offset: -80, duration: 1.6 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={navRef}
      className={`
        fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4
        flex items-center justify-between
        transition-all duration-500
        ${scrolled ? 'backdrop-blur-md border-b' : ''}
      `}
      style={{
        backgroundColor: scrolled ? 'rgba(var(--c-void-rgb, 10,10,10), 0.85)' : 'transparent',
        background: scrolled ? 'color-mix(in srgb, var(--c-void) 85%, transparent)' : 'transparent',
        borderColor: 'var(--c-ash)',
      }}
    >
      {/* Logo */}
      <a href="#" onClick={(e) => scrollTo(e, 'body')} className="anim-underline">
        <span className="font-display font-bold text-lg tracking-tighter" style={{ color: 'var(--c-bone)' }}>
          R<span style={{ color: 'var(--c-acid)' }}>.</span>
        </span>
      </a>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 nav-links">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={(e) => scrollTo(e, href)}
            className="font-mono text-xs tracking-widest uppercase transition-colors duration-300 anim-underline"
            style={{ color: 'var(--c-muted)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--c-bone)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--c-muted)')}
          >
            {label}
          </a>
        ))}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* CTA */}
        <a
          href="mailto:hello@raphael.dev"
          className="font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: 'var(--c-acid)', color: 'var(--c-void)' }}
        >
          Hire me
        </a>
      </nav>

      {/* Mobile row: theme + hamburger */}
      <div className="md:hidden flex items-center gap-3">
        <ThemeToggle />
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--c-bone)' }} />
          <span className={`block w-5 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: 'var(--c-bone)' }} />
          <span className={`block w-5 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} style={{ background: 'var(--c-bone)' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 backdrop-blur-md border-b py-6 px-8 flex flex-col gap-6 md:hidden"
          style={{ backgroundColor: 'color-mix(in srgb, var(--c-void) 95%, transparent)', borderColor: 'var(--c-ash)' }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => scrollTo(e, href)}
              className="font-display text-2xl font-bold transition-colors"
              style={{ color: 'var(--c-bone)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--c-acid)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--c-bone)')}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{ width: '100%', scaleX: 0, willChange: 'transform', backgroundColor: 'var(--c-acid)' }}
      />
    </header>
  );
}
