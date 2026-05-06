import './globals.css';

export const metadata = {
  title: 'Raphael — Creative Developer',
  description: 'Portfolio of Raphael (aka Suyash) — building beautiful digital experiences.',
  openGraph: {
    title: 'Raphael — Creative Developer',
    description: 'Portfolio of Raphael (aka Suyash) — building beautiful digital experiences.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        Google Fonts are loaded in globals.css via @import.
        We expose them as CSS variables via Tailwind's fontFamily config.
      */}
      <body className="bg-void text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
