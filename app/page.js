'use client';

import { useState } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Loader from '@/components/Loader';
import ParticleBackground from '@/components/ParticleBackground';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Grain texture */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Particle constellation — always rendered, behind everything */}
      <ParticleBackground />

      {/* Loading screen — unmounts itself via onComplete */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Custom cursor */}
      <Cursor />

      {/* Main site — rendered but invisible until loader wipes away */}
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>

        <footer className="border-t border-ash px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted font-mono text-xs tracking-widest"
          style={{ borderColor: 'var(--c-ash)', color: 'var(--c-muted)' }}
        >
          <span>© 2025 RAPHAEL aka SUYASH</span>
          <span style={{ color: 'var(--c-dim)' }}>BUILT WITH NEXT.JS + GSAP + LENIS</span>
        </footer>
      </SmoothScroll>
    </>
  );
}
