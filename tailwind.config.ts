import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#050B14',
        surface: '#0A1628',
        card: 'rgba(255,255,255,0.04)',
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        coral: {
          DEFAULT: '#F87171',
          light: '#FCA5A5',
          dark: '#EF4444',
        },
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
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
