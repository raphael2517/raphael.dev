'use client';

/**
 * ParticleBackground.jsx — PROPERLY FIXED
 *
 * Root cause of the yellow/green bug:
 *   Canvas ctx.fillStyle cannot read CSS variables like var(--c-acid).
 *   The previous version had RGB values hardcoded: '200, 255, 71' (acid green).
 *   No matter what you changed --c-acid to, canvas kept painting that green.
 *
 * The fix:
 *   getComputedStyle(document.documentElement).getPropertyValue('--c-acid')
 *   reads the ACTUAL current value of your CSS variable at runtime.
 *   We call this inside the draw loop so it updates whenever the theme changes.
 */

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 80;
const MAX_DISTANCE   = 140;
const MOUSE_RADIUS   = 100;
const MOUSE_FORCE    = 0.5;
const SPEED          = 0.3;

class Particle {
  constructor(w, h) { this.reset(w, h); }
  reset(w, h) {
    this.x  = Math.random() * w;
    this.y  = Math.random() * h;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r  = Math.random() * 1.5 + 0.5;
  }
  update(w, h, mouse) {
    if (mouse.x !== null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RADIUS && d > 0) {
        const f = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
        this.vx += (dx / d) * f * MOUSE_FORCE;
        this.vy += (dy / d) * f * MOUSE_FORCE;
      }
    }
    const spd = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    if (spd > SPEED * 3) {
      this.vx = (this.vx / spd) * SPEED * 3;
      this.vy = (this.vy / spd) * SPEED * 3;
    }
    this.vx *= 0.99; this.vy *= 0.99;
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = w; if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h; if (this.y > h) this.y = 0;
  }
}

/** Read a CSS variable's actual value from the document root */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement)
  .getPropertyValue(name)
  .trim();
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const mouse = { x: null, y: null };
    let particles = [];
    let rafId;

    const isLight = () =>
    document.documentElement.getAttribute('data-theme') === 'light';

    // Blend mode applied imperatively — JSX style prop is static after mount
  const syncBlend = () => {
    canvas.style.mixBlendMode = isLight() ? 'multiply' : 'screen';
  };
  syncBlend();

  const observer = new MutationObserver(syncBlend);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from(
      { length: PARTICLE_COUNT },
      () => new Particle(canvas.width, canvas.height)
    );
  };
  resize();
  window.addEventListener('resize', resize);

  const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  const onOut  = ()  => { mouse.x = null; mouse.y = null; };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseout',  onOut);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── Read YOUR actual CSS variable value every frame ─────────────────
    // This is the critical fix — whatever hex you set --c-acid to,
    // that's exactly what the canvas will paint.
    const accentColor = getCSSVar('--c-acid'); // e.g. '#00bcd4' for teal

    particles.forEach((p) => {
      p.update(canvas.width, canvas.height, mouse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = (1 - d / MAX_DISTANCE) * 0.22;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  };
  draw();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseout',  onOut);
    observer.disconnect();
  };
  }, []);

  return (
    <canvas
    ref={canvasRef}
    className="fixed inset-0 z-0 pointer-events-none"
    style={{ opacity: 0.7 }}
    />
  );
}
