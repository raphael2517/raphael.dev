'use client';

/**
 * Skills.jsx
 * ───────────
 * Two columns of skills:
 *
 * 1. PROGRESS BARS — Each bar uses a scaleX(0) → scaleX(n) animation
 *    linked to ScrollTrigger scrub. As you scroll through the section,
 *    the bars fill proportionally. Origin is "left" so they grow rightward.
 *
 * 2. ICON GRID — Tool/tech logos animate in with scale + fade stagger
 *    when the section enters the viewport.
 *
 * 3. SECTION NUMBER — A large decorative "03" parallaxes at a different
 *    rate to the content, creating depth.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────────────────

const TECHNICAL_SKILLS = [
  { label: 'Linux (Arch / Hyprland)', level: 95 },
  { label: 'System Monitoring & Debugging', level: 80 },
  { label: 'Cybersecurity Fundamentals', level: 75 },
  { label: 'Game Development (Godot / GDScript)', level: 82 },
  { label: 'C# / Programming Logic', level: 78 },
  { label: 'Networking Basics', level: 80 },
];

const DESIGN_SKILLS = [
  { label: 'Game UI/UX Design', level: 80 },
  { label: 'Aseprite (Pixel Art)', level: 75 },
  { label: 'Animation for Games', level: 72 },
  { label: 'Creative Direction (Story / Lore)', level: 93 },
];

const TOOLS = [
  'Hyprland', 'Neovim', 'Git', 'Docker', 'Godot',
  'Aseprite', 'Wireshark', 'htop', 'btop', 'systemd',
  'GitHub', 'Linux CLI',
];

// ── Animated skill bar component ──────────────────────────────────────────
function SkillBar({ label, level, index, trigger }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current || !trigger) return;

    // Bar grows from scaleX(0) to scaleX(level/100) as scroll progresses
    gsap.to(barRef.current, {
      scaleX: level / 100,
      ease: 'power2.out',
      duration: 1.2,
      delay: index * 0.07,  // Stagger via delay instead of GSAP stagger for finer control
      scrollTrigger: {
        trigger,
        start: 'top 75%',
      },
    });
  }, [trigger, level, index]);

  return (
    <div className="skill-row">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-bone">{label}</span>
        <span className="font-mono text-xs text-acid">{level}%</span>
      </div>
      {/* Track */}
      <div className="h-px bg-ash relative overflow-visible">
        {/* Fill — uses origin-left so scaleX grows from left */}
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 w-full bg-acid origin-left"
          style={{ scaleX: 0, willChange: 'transform', height: '1px' }}
        />
        {/* End dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-acid"
          style={{ left: `${level}%`, opacity: 0,
            animation: `count-up 0.4s ${0.8 + index * 0.07}s forwards` }}
        />
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef(null);
  const numberRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // ── Decorative large number parallax ──────────────────────────────────
    gsap.to(numberRef.current, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end:   'bottom top',
        scrub: 2,    // Smooth lag
      },
    });

    // ── Section heading animate in ────────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.skills-head'),
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      }
    );

    // ── Tool tags staggered pop in ────────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.tool-tag'),
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.06,
        duration: 0.5,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: section.querySelector('.tools-grid'),
          start: 'top 85%',
        },
      }
    );

    // ── Column cards fade in ──────────────────────────────────────────────
    gsap.fromTo(
      section.querySelectorAll('.skill-col'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section-anchor py-28 md:py-40 px-6 md:px-12 relative overflow-hidden bg-ink/40"
    >
      {/* Decorative oversized number */}
      <div
        ref={numberRef}
        className="absolute -right-6 top-0 font-display font-extrabold text-ash select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(8rem, 18vw, 16rem)', opacity: 0.15, willChange: 'transform' }}
        aria-hidden="true"
      >
        03
      </div>

      {/* Header */}
      <div className="mb-16 md:mb-24">
        <span className="tag skills-head mb-4 inline-flex">03 / Skills</span>
        <h2
          className="skills-head font-display font-extrabold tracking-tighter text-bone leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Tools &amp;<br />
          <span className="text-acid">Craft</span>
        </h2>
      </div>

      {/* Two-column skill bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-20">

        {/* Technical Skills */}
        <div className="skill-col space-y-6">
          <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase border-b border-ash pb-4">
            Technical
          </p>
          {TECHNICAL_SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.label}
              {...skill}
              index={i}
              trigger={sectionRef.current}
            />
          ))}
        </div>

        {/* Design Skills */}
        <div className="skill-col space-y-6">
          <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase border-b border-ash pb-4">
            Design
          </p>
          {DESIGN_SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.label}
              {...skill}
              index={i + TECHNICAL_SKILLS.length}
              trigger={sectionRef.current}
            />
          ))}

          {/* Extra — Tools I use */}
          <div className="pt-8">
            <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase mb-6">
              Tools &amp; ecosystem
            </p>
            <div className="tools-grid flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <span key={tool} className="tool-tag tag hover:border-acid/50 hover:text-bone transition-colors duration-300 cursor-default">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy quote */}
      <div className="border-l-2 border-acid pl-6 max-w-2xl skills-head">
        <p className="font-display text-xl md:text-2xl text-bone leading-snug tracking-tight">
          "The best code is the kind users never notice — <span className="text-acid">because it just works</span>."
        </p>
      </div>
    </section>
  );
}
