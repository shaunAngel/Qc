import { motion } from 'framer-motion';

interface QuantumOrbProps {
  size?: number;
  className?: string;
  score?: number;
}

export function QuantumOrb({
  size = 220,
  className = '',
  score = 87.4,
}: QuantumOrbProps) {
  const center = size / 2;

  const orbit1 = size * 0.40;
  const orbit2 = size * 0.31;
  const orbit3 = size * 0.21;

  const particles = [
    { angle: 0, radius: orbit1, duration: 7 },
    { angle: 120, radius: orbit1, duration: 9 },
    { angle: 240, radius: orbit1, duration: 8 },

    { angle: 40, radius: orbit2, duration: 5 },
    { angle: 180, radius: orbit2, duration: 6 },
    { angle: 300, radius: orbit2, duration: 7 },

    { angle: 80, radius: orbit3, duration: 4 },
    { angle: 220, radius: orbit3, duration: 5 },
  ];

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-[18%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,.20), rgba(6,182,212,.08), transparent 70%)',
          filter: 'blur(18px)',
        }}
        animate={{
          scale: [0.9, 1.12, 0.9],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10 overflow-visible"
      >
        <defs>

          <filter id="quantum-glow">
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="small-glow">
            <feGaussianBlur
              stdDeviation="1.2"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="core-gradient">
            <stop
              offset="0%"
              stopColor="#67E8F9"
              stopOpacity="0.95"
            />

            <stop
              offset="35%"
              stopColor="#10B981"
              stopOpacity="0.7"
            />

            <stop
              offset="70%"
              stopColor="#06B6D4"
              stopOpacity="0.18"
            />

            <stop
              offset="100%"
              stopColor="#030914"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/* Outer orbit */}
        <motion.ellipse
          cx={center}
          cy={center}
          rx={orbit1}
          ry={orbit1 * 0.36}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="1"
          strokeDasharray="5 8"
          opacity="0.55"
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Second orbit */}
        <motion.ellipse
          cx={center}
          cy={center}
          rx={orbit2}
          ry={orbit2 * 0.48}
          fill="none"
          stroke="#10B981"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.7"
          animate={{ rotate: -360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Third orbit */}
        <motion.circle
          cx={center}
          cy={center}
          r={orbit3}
          fill="none"
          stroke="rgba(103,232,249,.35)"
          strokeWidth="0.8"
          strokeDasharray="2 5"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Core */}
        <motion.circle
          cx={center}
          cy={center}
          r={size * 0.20}
          fill="url(#core-gradient)"
          filter="url(#quantum-glow)"
          animate={{
            scale: [0.92, 1.08, 0.92],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Core ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={size * 0.14}
          fill="rgba(3,9,20,.72)"
          stroke="#10B981"
          strokeWidth="1"
          animate={{
            strokeOpacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Score */}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          fill="#F1F5F9"
          fontSize={size * 0.095}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="700"
        >
          {score.toFixed(1)}%
        </text>

        <text
          x={center}
          y={center + size * 0.075}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize={size * 0.038}
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="2"
        >
          OPTIMIZATION
        </text>

        {/* Orbit particles */}
        {particles.map((particle, index) => (
          <motion.circle
            key={index}
            cx={center + particle.radius}
            cy={center}
            r={index % 3 === 0 ? 2 : 1.25}
            fill={
              index % 2 === 0
                ? '#34D399'
                : '#67E8F9'
            }
            filter="url(#small-glow)"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: -particle.duration * (particle.angle / 360),
            }}
            style={{
              transformOrigin: `${center}px ${center}px`,
            }}
          />
        ))}

        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={center}
            cy={center}
            r={size * 0.19}
            fill="none"
            stroke="#10B981"
            strokeWidth="0.7"
            animate={{
              r: [
                size * 0.19,
                size * 0.42,
              ],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>

      {/* Tiny telemetry labels */}
      <div className="absolute left-0 top-[22%] font-mono text-[8px] text-text-secondary">
        Q-CORE
      </div>

      <div className="absolute right-0 top-[34%] font-mono text-[8px] text-cyan">
        LIVE
      </div>

      <div className="absolute left-[15%] bottom-[13%] font-mono text-[8px] text-emerald">
        ACTIVE
      </div>

      <div className="absolute right-[12%] bottom-[18%] font-mono text-[8px] text-text-secondary">
        42ms
      </div>
    </div>
  );
}