import { motion } from 'framer-motion';

interface QuantumOrbProps {
  size?: number;
  className?: string;
}

export function QuantumOrb({ size = 120, className = '' }: QuantumOrbProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const middleR = size * 0.30;
  const innerR = size * 0.18;
  const dotR = size * 0.05;

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="orb-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer ring — slow rotation, cyan */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1.5"
          strokeDasharray={`${outerR * 0.6} ${outerR * 0.4}`}
          animate={{ rotate: 360, opacity: [0.3, 0.8, 0.3] }}
          transition={{
            rotate: { duration: 8, ease: 'linear', repeat: Infinity },
            opacity: { duration: 3, ease: 'easeInOut', repeat: Infinity },
          }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />

        {/* Middle ring — opposite rotation, emerald */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={middleR}
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray={`${middleR * 0.7} ${middleR * 0.3}`}
          animate={{ rotate: -360, opacity: [0.5, 1, 0.5] }}
          transition={{
            rotate: { duration: 5, ease: 'linear', repeat: Infinity },
            opacity: { duration: 2.5, ease: 'easeInOut', repeat: Infinity },
          }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />

        {/* Inner filled circle — scale pulse, cyan at 30% */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="rgba(6,182,212,0.30)"
          stroke="#06B6D4"
          strokeWidth="1"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />

        {/* Center dot */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={dotR}
          fill="#06B6D4"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          style={{ originX: `${cx}px`, originY: `${cy}px` }}
        />
      </svg>
    </div>
  );
}
