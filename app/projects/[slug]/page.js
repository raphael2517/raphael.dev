'use client';

/**
 * app/projects/[slug]/page.js
 * ────────────────────────────
 * Dynamic project detail / case study page.
 *
 * Animations:
 * 1. PAGE ENTER — Hero title reveals char-by-char (same as Hero.jsx),
 *    meta info fades in from below with stagger.
 *
 * 2. CONTENT SCROLL — Sections fade + slide in on scroll via ScrollTrigger.
 *
 * 3. GALLERY — Images stagger in as the gallery section enters the viewport.
 *
 * 4. "NEXT PROJECT" — Bottom CTA links to the next project.
 *    On click, a GSAP exit animation slides content up + fades out,
 *    then router.push() navigates.
 *
 * 5. BACK TRANSITION — Clicking "← Back" reverses: content slides down
 *    and fades while navigating to /#projects.
 */

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectBySlug, getAdjacentProjects } from '@/lib/projects';
import Cursor from '@/components/Cursor';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail() {
  const { slug }            = useParams();
  const router              = useRouter();
  const pageRef             = useRef(null);
  const heroRef             = useRef(null);
  const contentRef          = useRef(null);

  const project  = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);

  useEffect(() => {
    if (!project) return;
    const page = pageRef.current;

    // ── Page enter animation ──────────────────────────────────────────────
    const chars = page.querySelectorAll('.detail-char');
    gsap.set(chars, { y: '110%' });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(chars, { y: '0%', stagger: 0.025, duration: 0.9, delay: 0.1 })
      .fromTo(
        page.querySelectorAll('.meta-el'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.7 },
        '-=0.5'
      );

    // ── Content sections scroll reveal ───────────────────────────────────
    gsap.fromTo(
      page.querySelectorAll('.content-block'),
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
      }
    );

    // ── Gallery images stagger ────────────────────────────────────────────
    gsap.fromTo(
      page.querySelectorAll('.gallery-img'),
      { scale: 0.94, opacity: 0 },
      {
        scale: 1, opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: page.querySelector('.gallery-section'),
          start: 'top 80%',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, [project]);

  // Exit animation → navigate
  const navigateTo = (e, path) => {
    e.preventDefault();
    gsap.to(pageRef.current, {
      y: -40,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => router.push(path),
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void text-bone">
        <div className="text-center">
          <p className="font-mono text-muted text-sm mb-4">Project not found</p>
          <Link href="/#projects" className="text-acid underline">← Back to projects</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Cursor />
      <SmoothScroll>
        <div ref={pageRef} className="bg-void text-bone min-h-screen">

          {/* ── Back nav ──────────────────────────────────────────────────── */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between bg-void/80 backdrop-blur-md border-b border-ash/30">
            <a
              href="/#projects"
              onClick={(e) => navigateTo(e, '/#projects')}
              className="group flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted hover:text-bone transition-colors"
            >
              <span className="transition-all duration-300 group-hover:-translate-x-1">←</span>
              All projects
            </a>

            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs tracking-widest uppercase px-4 py-2 border border-ash rounded-full text-muted hover:text-bone hover:border-acid/50 transition-all duration-300"
            >
              Live site ↗
            </a>
          </nav>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div
            ref={heroRef}
            className="min-h-screen flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 pt-32 relative overflow-hidden"
          >
            {/* Background accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${project.color}10 0%, transparent 60%)`,
              }}
            />

            {/* Project number */}
            <p className="meta-el font-mono text-xs tracking-widest text-muted uppercase mb-8">
              {String(project.id).padStart(2, '0')} / {PROJECTS_LENGTH} — {project.year}
            </p>

            {/* Title — char split */}
            <h1
              className="font-display font-extrabold leading-none tracking-tighter text-bone mb-6"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
              aria-label={project.title}
            >
              {project.title.split('').map((c, i) => (
                <span key={i} className="char-wrap" aria-hidden="true">
                  <span className="detail-char inline-block">
                    {c === ' ' ? '\u00A0' : c}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="meta-el font-display text-muted tracking-tight max-w-lg"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
            >
              {project.tagline}
            </p>

            {/* Meta grid */}
            <div className="meta-el grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-ash">
              {[
                { label: 'Role',     value: project.role     },
                { label: 'Duration', value: project.duration  },
                { label: 'Year',     value: project.year      },
                { label: 'Stack',    value: project.tags.slice(0, 2).join(', ') },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] tracking-widest text-muted uppercase mb-1">{label}</p>
                  <p className="font-body text-bone text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cover image ───────────────────────────────────────────────── */}
          <div className="px-6 md:px-12 mb-16">
            <div
              className="w-full rounded-2xl overflow-hidden bg-carbon border border-ash"
              style={{ aspectRatio: '16/9' }}
            >
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, #1a1a1a, ${project.color}15)` }}
                >
                  <span
                    className="font-display font-extrabold"
                    style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: `${project.color}20` }}
                  >
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Case study content ────────────────────────────────────────── */}
          <div
            ref={contentRef}
            className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-24"
          >
            {/* Main content */}
            <div className="md:col-span-7 space-y-8">
              <div className="content-block">
                <h2 className="font-display font-bold text-2xl text-bone mb-4">Overview</h2>
                <div className="space-y-4">
                  {project.fullDescription.trim().split('\n\n').map((para, i) => (
                    <p key={i} className="text-muted leading-relaxed text-base">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-5 space-y-8">
              {/* Tech stack */}
              <div className="content-block bg-carbon border border-ash rounded-2xl p-6">
                <h3 className="font-mono text-xs tracking-widest text-muted uppercase mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag hover:border-acid/50 hover:text-bone transition-colors duration-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="content-block space-y-3">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-5 py-4 bg-acid text-void font-mono text-sm tracking-widest uppercase rounded-xl font-bold hover:bg-glow transition-colors duration-300"
                >
                  View live site
                  <span>↗</span>
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-full px-5 py-4 border border-ash text-bone font-mono text-sm tracking-widest uppercase rounded-xl hover:border-acid/50 transition-colors duration-300"
                >
                  GitHub repo
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Gallery ───────────────────────────────────────────────────── */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="gallery-section px-6 md:px-12 mb-24">
              <h2 className="font-display font-bold text-2xl text-bone mb-8">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="gallery-img w-full rounded-xl overflow-hidden bg-carbon border border-ash"
                    style={{ aspectRatio: '9/16', maxHeight: '400px' }}
                  >
                    {img ? (
                      <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(${135 + i * 45}deg, #1a1a1a, ${project.color}10)` }}
                      >
                        <span className="font-mono text-xs text-dim tracking-widest">Screenshot {i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Next project CTA ──────────────────────────────────────────── */}
          <div className="border-t border-ash">
            <a
              href={`/projects/${next.slug}`}
              onClick={(e) => navigateTo(e, `/projects/${next.slug}`)}
              className="group block px-6 md:px-12 py-16 md:py-24 hover:bg-carbon/40 transition-colors duration-500"
              data-cursor-expand
            >
              <p className="font-mono text-xs tracking-widest text-muted uppercase mb-4">Next project</p>
              <div className="flex items-center justify-between">
                <h2
                  className="font-display font-extrabold tracking-tighter text-bone group-hover:text-acid transition-colors duration-500 leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
                >
                  {next.title}
                </h2>
                <span
                  className="text-4xl md:text-6xl text-muted group-hover:text-acid transition-all duration-500 group-hover:translate-x-3"
                  style={{ display: 'inline-block' }}
                >
                  →
                </span>
              </div>
            </a>
          </div>

        </div>
      </SmoothScroll>
    </>
  );
}

// Needed for the meta grid project counter
const PROJECTS_LENGTH = 4;
