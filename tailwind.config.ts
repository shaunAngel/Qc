import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        overlay: 'var(--color-overlay)',
        emerald: {
          DEFAULT: 'var(--color-emerald)',
          light: 'var(--color-emerald-light)',
          dark: 'var(--color-emerald-dark)',
        },
        cyan: {
          DEFAULT: 'var(--color-cyan)',
          light: 'var(--color-cyan-light)',
          dark: 'var(--color-cyan-dark)',
        },
        amber: {
          DEFAULT: 'var(--color-amber)',
          light: 'var(--color-amber-light)',
          dark: 'var(--color-amber-dark)',
        },
        coral: {
          DEFAULT: 'var(--color-coral)',
          light: 'var(--color-coral-light)',
          dark: 'var(--color-coral-dark)',
        },
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.3)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.3)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.3)',
        'glow-coral': '0 0 20px rgba(248,113,113,0.3)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
} satisfies Config
