/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark base palette
        void:    '#0a0a0a',
        ink:     '#111111',
        carbon:  '#1a1a1a',
        ash:     '#2a2a2a',
        // Accent — electric lime
        acid:    '#c8ff47',
        glow:    '#a8f030',
        // Text
        bone:    '#f0ede6',
        muted:   '#6b6b6b',
        dim:     '#3d3d3d',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        '10xl': '10rem',
        '11xl': '12rem',
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter:  '-0.04em',
      },
    },
  },
  plugins: [],
};
