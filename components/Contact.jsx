'use client';

/**
 * Contact.jsx
 * ────────────
 * Elegant contact section with:
 *
 * 1. BIG EMAIL LINK — Oversized typography that fills the width, using
 *    CSS clamp(). On hover, the background transitions to acid with
 *    an Anime.js ripple effect on click.
 *
 * 2. SCROLL-IN REVEAL — All elements use GSAP fromTo with ScrollTrigger.
 *
 * 3. SOCIAL LINKS — Icon-free, typography-first social grid.
 *
 * 4. ANIME.JS BUTTON RIPPLE — On clicking "Send message", a ripple
 *    emanates from the click point using Anime.js (a great use case
 *    for its timeline API at a small scale).
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/raphael2517' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suyash-namdeo-09b021275/' },
  { label: 'Instagram', href: 'https://instagram.com/notyashatalll' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const emailRef   = useRef(null);
  const formRef    = useRef(null);
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    // ── All contact elements reveal ───────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.contact-el'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      }
    );

    // ── Email link: horizontal slide from left ────────────────────────────
    gsap.fromTo(
      emailRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: emailRef.current,
          start: 'top 85%',
        },
      }
    );

    // ── Anime.js ripple on email hover ────────────────────────────────────
    // We use dynamic import to avoid SSR issues with anime.js
    const emailEl = emailRef.current;
    let anime;

    import('animejs').then(({ default: animeJs }) => {
      anime = animeJs;

      const handleClick = (e) => {
        // Create ripple element
        const ripple = document.createElement('div');
        const rect   = emailEl.getBoundingClientRect();

        ripple.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(200, 255, 71, 0.4);
          pointer-events: none;
          top: ${e.clientY - rect.top - 10}px;
          left: ${e.clientX - rect.left - 10}px;
          transform: scale(0);
          z-index: 10;
        `;
        emailEl.appendChild(ripple);

        animeJs({
          targets: ripple,
          scale: [0, 15],
          opacity: [1, 0],
          duration: 800,
          easing: 'easeOutExpo',
          complete: () => ripple.remove(),
        });
      };

      emailEl.addEventListener('click', handleClick);
      return () => emailEl.removeEventListener('click', handleClick);
    });
  }, []);

  // ── Simple form submit (Formspree / any backend) ──────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Animate button to "sending" state using GSAP
    gsap.to(formRef.current.querySelector('.submit-btn'), {
      scale: 0.97,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });

    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1500));

    // Anime.js success pulse
    import('animejs').then(({ default: anime }) => {
      anime({
        targets: formRef.current.querySelector('.submit-btn'),
        backgroundColor: ['#c8ff47', '#a8f030'],
        scale: [1, 1.04, 1],
        duration: 600,
        easing: 'spring(1, 80, 10, 0)',
      });
    });

    setSending(false);
    setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-anchor py-28 md:py-40 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(200,255,71,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Header */}
      <div className="mb-16">
        <span className="tag contact-el mb-4 inline-flex">04 / Contact</span>
        <h2
          className="contact-el font-display font-extrabold tracking-tighter text-bone leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Let's build<br />
          <span className="text-acid">something great</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

        {/* ── Left — Big email + socials ───────────────────────────────── */}
        <div>
          <p className="contact-el text-muted text-base leading-relaxed mb-10 max-w-sm">
            Have a project in mind? Looking for a collaborator? Or just want to say hi?
            My inbox is always open.
          </p>

          {/* Giant email link */}
          <a
            ref={emailRef}
            href="mailto:hello@raphael.dev"
            className="contact-el group relative block overflow-hidden rounded-xl border border-ash px-6 py-5 mb-10 hover:border-acid/50 transition-border duration-300"
            style={{ willChange: 'transform' }}
          >
            <div className="absolute inset-0 bg-acid/0 group-hover:bg-acid/5 transition-colors duration-500" />
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase mb-2">Email</p>
            <p
              className="font-display font-bold text-bone group-hover:text-acid transition-colors duration-300 leading-none tracking-tighter"
              style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}
            >
              hello@raphael.dev
            </p>
            <span className="absolute right-6 bottom-5 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
          </a>

          {/* Socials */}
          <div className="contact-el grid grid-cols-2 gap-3">
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between px-4 py-3 border border-ash rounded-lg hover:border-acid/40 hover:text-bone transition-all duration-300"
              >
                <span className="font-mono text-xs tracking-widest text-muted uppercase group-hover:text-bone transition-colors duration-300">
                  {label}
                </span>
                <span className="text-xs text-muted group-hover:text-acid transition-colors duration-300">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Right — Contact form ─────────────────────────────────────── */}
        <div className="contact-el">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full min-h-64 text-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-acid flex items-center justify-center text-acid text-2xl">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-bone">Message sent!</h3>
              <p className="text-muted text-sm">I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: 'Name',    name: 'name',    type: 'text',  placeholder: 'Your name' },
                { label: 'Email',   name: 'email',   type: 'email', placeholder: 'your@email.com' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="font-mono text-xs tracking-widest text-muted uppercase block mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    required
                    placeholder={placeholder}
                    className="
                      w-full bg-transparent border border-ash rounded-lg px-4 py-3
                      font-body text-bone text-sm placeholder:text-dim
                      focus:outline-none focus:border-acid/50
                      transition-colors duration-300
                    "
                  />
                </div>
              ))}

              <div>
                <label className="font-mono text-xs tracking-widest text-muted uppercase block mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="
                    w-full bg-transparent border border-ash rounded-lg px-4 py-3
                    font-body text-bone text-sm placeholder:text-dim resize-none
                    focus:outline-none focus:border-acid/50
                    transition-colors duration-300
                  "
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="
                  submit-btn w-full py-4 bg-acid text-void font-mono text-sm
                  tracking-widest uppercase rounded-xl font-bold
                  hover:bg-glow active:scale-95
                  transition-all duration-300
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
                style={{ willChange: 'transform' }}
              >
                {sending ? 'Sending...' : 'Send message →'}
              </button>

              <p className="font-mono text-xs text-dim text-center">
                Or email directly at hello@raphael.dev
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
