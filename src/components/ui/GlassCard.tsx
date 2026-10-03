import { motion } from 'framer-motion';

type Accent = 'emerald' | 'cyan' | 'amber' | 'coral' | 'none';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  accent?: Accent;
  animate?: boolean;
}

const accentGlow: Record<Accent, string> = {
  emerald: '0 0 24px rgba(16,185,129,0.2), 0 4px 32px rgba(0,0,0,0.4)',
  cyan:    '0 0 24px rgba(6,182,212,0.2), 0 4px 32px rgba(0,0,0,0.4)',
  amber:   '0 0 24px rgba(245,158,11,0.2), 0 4px 32px rgba(0,0,0,0.4)',
  coral:   '0 0 24px rgba(248,113,113,0.2), 0 4px 32px rgba(0,0,0,0.4)',
  none:    '0 0 24px rgba(255,255,255,0.05), 0 4px 32px rgba(0,0,0,0.4)',
};

const accentBorder: Record<Accent, string> = {
  emerald: 'rgba(16,185,129,0.35)',
  cyan:    'rgba(6,182,212,0.35)',
  amber:   'rgba(245,158,11,0.35)',
  coral:   'rgba(248,113,113,0.35)',
  none:    'rgba(255,255,255,0.12)',
};

export function GlassCard({
  children,
  className = '',
  accent = 'none',
  animate = false,
}: GlassCardProps) {
  const baseStyle: React.CSSProperties = {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1rem',
  };

  if (!animate) {
    return (
      <div style={baseStyle} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={baseStyle}
      whileHover={{
        scale: 1.02,
        boxShadow: accentGlow[accent],
        borderColor: accentBorder[accent],
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
