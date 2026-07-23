import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CLAUDE.md palette — CSS-variable-backed
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'text-light': 'var(--text-light)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
