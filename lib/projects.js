/**
 * lib/projects.js — Raphael aka Suyash's real projects
 *
 * TO ADD A NEW PROJECT:
 *   1. Add object to PROJECTS array below
 *   2. Drop screenshot in /public/projects/ (9:16 portrait preferred)
 *   3. Done — card + detail page auto-generate
 */

export const PROJECTS = [
  {
    id: 1,
    slug: 'netmanager',
    title: 'netmanager',
    tagline: 'One TUI to rule all your network interfaces',
    description:
      'A unified CLI/TUI network manager for Linux — handles Wi-Fi hotspots, OpenVPN/WireGuard VPN, and Bluetooth from a single ncurses interface.',
    fullDescription: `Managing a Linux network stack usually means juggling five different tools across three terminal windows. netmanager collapses all of that into a single, keyboard-driven ncurses interface.

The project was born out of frustration: security software kept blocking hotspot channels whenever the adapter was already on 5 GHz. The solution was building a tool that reads the active channel via iw and reuses it automatically — no more hostapd startup failures.

Under the hood, the core logic is written in C for raw performance and system-level access, with a Bash layer handling the interactive TUI and dependency checks. The architecture cleanly separates concerns: C owns the network operations, Bash owns the UI loop.

netmanager v1.0.0 runs consistently across Arch Linux, Manjaro, Debian, and Fedora — whatever you're running, it just works.`,
    tags: ['C', 'Bash', 'ncurses', 'Linux', 'NetworkManager', 'hostapd'],
    image: '/projects/netmanager.png',
    gallery: ['/projects/netmanager.png'],
    href: 'https://github.com/raphael2517/netmanager',
    github: 'https://github.com/raphael2517/netmanager',
    year: '2025',
    role: 'Solo — Systems Engineering',
    duration: '6 weeks',
    featured: true,
    color: '#47c8ff',
  },
  {
    id: 2,
    slug: 'linux-guardian',
    title: 'Linux Guardian',
    tagline: 'Analyze. Score. Harden.',
    description:
      'A modular Linux security auditing tool in Rust. Inspects critical system configurations, evaluates risk exposure, and generates a weighted security score with letter grading A–F.',
    fullDescription: `Most Linux security tools tell you what's wrong but not how wrong. Linux Guardian fixes that with a weighted scoring system that grades your system A through F — like a report card for your security posture.

The tool inspects critical system configurations across multiple domains: SSH hardening, firewall rules, kernel parameters, file permissions, and running services. Each check returns a structured CheckResult that feeds into the final weighted score.

Written entirely in Rust for performance and memory safety. The architecture is intentionally modular — each security domain is an independent module, making it easy to add new checks without touching existing ones.

The clean separation between check logic and reporting means Linux Guardian can output results as human-readable text, JSON, or pipe into other tools. Built for Linux power users and sysadmins who want signal, not noise.`,
    tags: ['Rust', 'Linux', 'Security', 'CLI', 'Systems'],
    image: '/projects/linux-guardian.png',
    gallery: [],
    href: 'https://github.com/raphael2517/linux-guardian',
    github: 'https://github.com/raphael2517/linux-guardian',
    year: '2025',
    role: 'Solo — Systems + Security Engineering',
    duration: '3 months',
    featured: false,
    color: '#ff4747',
  },
  {
    id: 3,
    slug: 'wifi-hotspot',
    title: 'wifi-hotspot',
    tagline: 'Hotspot that actually starts on the first try',
    description:
      'A lightweight Linux Wi-Fi hotspot manager with automatic channel detection — built because every other tool breaks when your adapter is already on 5 GHz.',
    fullDescription: `Here is a bug that has bitten every Linux user who has tried to share their connection: you are connected to a 5 GHz network, you start a hotspot, and hostapd crashes immediately. The channel mismatch kills it before a single packet is sent.

wifi-hotspot exists to solve exactly that. It uses iw to read the channel your adapter is currently operating on and passes that channel directly to hostapd — no guessing, no hardcoded defaults, no crashes.

The architecture splits cleanly between a C core that handles all network operations and a Bash layer that drives the interactive CLI. This keeps the performance-critical code fast and the user-facing logic flexible.

This project later became the foundation for the Wi-Fi Hotspot Manager module inside netmanager, where the same channel-detection logic runs at the heart of a larger TUI.`,
    tags: ['C', 'Bash', 'hostapd', 'iw', 'Linux', 'Wi-Fi'],
    image: '/projects/wifi-hotspot.png',
    gallery: [],
    href: 'https://github.com/raphael2517/wifi-hotspot',
    github: 'https://github.com/raphael2517/wifi-hotspot',
    year: '2024',
    role: 'Solo — Systems Engineering',
    duration: '2 weeks',
    featured: false,
    color: '#c8ff47',
  },
];

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}

export function getAdjacentProjects(slug) {
  const idx  = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = PROJECTS[idx - 1] || PROJECTS[PROJECTS.length - 1];
  const next = PROJECTS[idx + 1] || PROJECTS[0];
  return { prev, next };
}
