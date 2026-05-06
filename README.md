# Raphael Portfolio
### Next.js · GSAP · Lenis · Anime.js · Tailwind CSS

A premium, scroll-animated personal portfolio inspired by animejs.com's fluid, synchronized motion design.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## Project Structure

```
raphael-portfolio/
├── app/
│   ├── globals.css          # Base styles, CSS variables, utility classes
│   ├── layout.js            # Root layout with font setup
│   └── page.js              # Main page — assembles all sections
│
├── components/
│   ├── SmoothScroll.jsx     # Lenis + GSAP ScrollTrigger sync
│   ├── Cursor.jsx           # Custom magnetic cursor
│   ├── Navbar.jsx           # Fixed nav + scroll progress bar
│   ├── Hero.jsx             # Full-viewport hero with char reveal
│   ├── About.jsx            # Fade/slide about section
│   ├── Projects.jsx         # Animated project cards (9:16 images)
│   ├── Skills.jsx           # Scroll-scrubbed progress bars
│   └── Contact.jsx          # Contact form + Anime.js ripple
│
├── public/
│   └── projects/            # ← Put your project images here (9:16 ratio)
│
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## How Each Animation Works

### 🔵 Smooth Scrolling (Lenis + GSAP)
`SmoothScroll.jsx` initializes Lenis and connects it to GSAP's ScrollTrigger via two hooks:
```js
lenis.on('scroll', ScrollTrigger.update);   // Feeds Lenis position to GSAP
gsap.ticker.add((time) => lenis.raf(time * 1000)); // Shared RAF loop
```
This ensures scroll-linked animations (`scrub: true`) are perfectly synchronized.

### 🟡 Hero Text Reveal
Characters are split into individual `<span>` elements inside overflow-hidden wrappers (`.char-wrap`). Each char starts at `y: '110%'` and animates to `y: '0%'` with a 30ms stagger — the clipping creates a "rising from below" reveal.

### 🟢 Parallax Layers
The hero heading and subtitle scroll at different speeds using `ScrollTrigger` with `scrub: 1.5`:
```js
gsap.to(headRef.current, {
  y: -120,
  scrollTrigger: { scrub: 1.5 }  // Higher = more lag = smoother
});
```

### 🔴 Project Card 3D Tilt
Cards respond to mouse position using `gsap.quickTo()` (optimized setter that avoids creating new tweens):
```js
const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.4 });
const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.4 });
```

### 🟣 Skill Progress Bars
Bars use `transform-origin: left` and animate from `scaleX(0)` to `scaleX(level / 100)` when their section enters the viewport, giving a precise percentage-based fill.

### 🟠 Custom Cursor
Two elements (dot + ring) with separate `gsap.quickTo()` setters at different speeds simulate the magnetic lag. Blend mode `difference` makes it invert colors underneath.

### ⚡ Anime.js Ripple (Contact)
On email link click, Anime.js creates a `scale: [0, 15]` + `opacity: [1, 0]` animation on a dynamically injected div, producing a ripple from the click point.

---

## Adding New Projects

Open `components/Projects.jsx` and add to the `PROJECTS` array:

```js
{
  id: 5,
  title: 'My New Project',
  description: 'One sentence about what it does.',
  tags: ['React', 'Node.js'],
  image: '/projects/my-new-project.jpg',  // 9:16 portrait image
  href: 'https://yourproject.com',
  year: '2025',
  featured: false,   // true = card spans 2 columns
},
```

> **Image tip**: All project images should be in **9:16 portrait ratio** (e.g., 900×1600px). Place them in `public/projects/`.

---

## Customization

### Colors
Edit CSS variables in `globals.css` or `tailwind.config.js`:
```css
:root {
  --c-acid: #c8ff47;  /* Main accent — electric lime */
  --c-bone: #f0ede6;  /* Primary text */
  --c-void: #0a0a0a;  /* Background */
}
```

### Fonts
Change the Google Fonts `@import` in `globals.css` and update `tailwind.config.js` `fontFamily`.

### Scroll Speed
Adjust Lenis `duration` in `SmoothScroll.jsx`:
```js
const lenis = new Lenis({ duration: 1.4 });  // Higher = slower/smoother
```

---

## Production Build

```bash
npm run build
npm start
```

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 14 | React framework + routing |
| Tailwind CSS | 3 | Utility-first styling |
| GSAP + ScrollTrigger | 3.12 | Scroll-linked animations |
| Lenis | 1.0 | Smooth scroll interpolation |
| Anime.js | 3.2 | Micro UI animations |
