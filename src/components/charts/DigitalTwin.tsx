import { motion } from 'framer-motion';
import { useState } from 'react';

type VesselNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'active' | 'warning' | 'port' | 'maintenance';
  fuel: number;
  efficiency: number;
};

const vessels: VesselNode[] = [
  {
    id: 'VQ-01',
    name: 'Emerald Voyager',
    x: 18,
    y: 34,
    status: 'active',
    fuel: 90,
    efficiency: 94,
  },
  {
    id: 'VQ-02',
    name: 'Pacific Quantum',
    x: 34,
    y: 62,
    status: 'port',
    fuel: 40,
    efficiency: 82,
  },
  {
    id: 'VQ-03',
    name: 'Atlas Green',
    x: 52,
    y: 30,
    status: 'warning',
    fuel: 15,
    efficiency: 61,
  },
  {
    id: 'VQ-04',
    name: 'Verdant Horizon',
    x: 70,
    y: 54,
    status: 'active',
    fuel: 75,
    efficiency: 91,
  },
  {
    id: 'VQ-05',
    name: 'Quantum Dawn',
    x: 84,
    y: 30,
    status: 'maintenance',
    fuel: 0,
    efficiency: 42,
  },
  {
    id: 'VQ-06',
    name: 'Ocean Prime',
    x: 74,
    y: 78,
    status: 'active',
    fuel: 85,
    efficiency: 96,
  },
];

const colors = {
  active: '#10B981',
  warning: '#F59E0B',
  port: '#06B6D4',
  maintenance: '#F87171',
};

const statusLabels = {
  active: 'OPTIMAL',
  warning: 'ANOMALY',
  port: 'IN PORT',
  maintenance: 'MAINTENANCE',
};

const routes = [
  { from: vessels[0], to: vessels[1] },
  { from: vessels[1], to: vessels[2] },
  { from: vessels[2], to: vessels[3] },
  { from: vessels[3], to: vessels[4] },
  { from: vessels[3], to: vessels[5] },
];

function routePath(
  from: VesselNode,
  to: VesselNode,
): string {
  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  const midX = (x1 + x2) / 2;
  const curve = Math.abs(x2 - x1) * 0.18;

  return `M ${x1} ${y1}
          Q ${midX} ${Math.min(y1, y2) - curve}
          ${x2} ${y2}`;
}

function Grid() {
  return (
    <>
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2="100"
          stroke="rgba(148,163,184,0.07)"
          strokeWidth="0.15"
        />
      ))}

      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 12.5}
          x2="100"
          y2={i * 12.5}
          stroke="rgba(148,163,184,0.07)"
          strokeWidth="0.15"
        />
      ))}
    </>
  );
}

export function DigitalTwin() {
  const [selected, setSelected] = useState<VesselNode | null>(null);

  return (
    <div className="relative w-full h-full min-h-[360px] overflow-hidden rounded-xl bg-[#030914]">

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at 50% 45%,
              rgba(16,185,129,0.10),
              transparent 42%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(6,182,212,0.08),
              transparent 30%
            )
          `,
        }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
          </span>

          <span className="font-mono text-[10px] tracking-[0.18em] text-emerald">
            LIVE DIGITAL TWIN
          </span>
        </div>

        <p className="mt-1 text-[10px] text-text-secondary font-mono">
          GLOBAL FLEET TELEMETRY // STREAMING
        </p>
      </div>

      {/* Metrics */}
      <div className="absolute top-4 right-4 z-20 flex gap-5">
        <div className="text-right">
          <p className="text-[9px] font-mono text-text-secondary">
            NODES
          </p>
          <p className="text-sm font-mono text-text-primary">
            06<span className="text-text-secondary">/06</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-mono text-text-secondary">
            STREAM
          </p>
          <p className="text-sm font-mono text-emerald">
            184/s
          </p>
        </div>
      </div>

      {/* Main visualization */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>

          {/* Route glow */}
          <filter id="route-glow">
            <feGaussianBlur
              stdDeviation="0.8"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow */}
          <filter id="node-glow">
            <feGaussianBlur
              stdDeviation="1.2"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scan gradient */}
          <linearGradient
            id="scan-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#10B981"
              stopOpacity="0"
            />
            <stop
              offset="50%"
              stopColor="#10B981"
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              stopColor="#10B981"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Perspective-ish grid */}
        <Grid />

        {/* Latitude-style curves */}
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse
            key={`lat-${i}`}
            cx="50"
            cy="50"
            rx={20 + i * 15}
            ry={10 + i * 5}
            fill="none"
            stroke="rgba(6,182,212,0.035)"
            strokeWidth="0.2"
          />
        ))}

        {/* Energy routes */}
        {routes.map(({ from, to }, index) => {
          const path = routePath(from, to);

          return (
            <g key={`${from.id}-${to.id}`}>

              <motion.path
                d={path}
                fill="none"
                stroke="rgba(16,185,129,0.16)"
                strokeWidth="0.65"
                filter="url(#route-glow)"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Moving energy packet */}
              <motion.circle
                r="0.75"
                fill="#34D399"
                filter="url(#node-glow)"
              >
                <animateMotion
                  dur={`${2.4 + index * 0.35}s`}
                  repeatCount="indefinite"
                  path={path}
                />
              </motion.circle>

              <motion.circle
                r="0.35"
                fill="#67E8F9"
              >
                <animateMotion
                  dur={`${2.4 + index * 0.35}s`}
                  begin="0.8s"
                  repeatCount="indefinite"
                  path={path}
                />
              </motion.circle>
            </g>
          );
        })}

        {/* Central system hub */}
        <motion.g
          animate={{
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="rgba(6,182,212,0.05)"
            stroke="rgba(6,182,212,0.25)"
            strokeWidth="0.3"
          />

          <circle
            cx="50"
            cy="50"
            r="3"
            fill="rgba(16,185,129,0.15)"
            stroke="#10B981"
            strokeWidth="0.4"
          />

          <circle
            cx="50"
            cy="50"
            r="1"
            fill="#34D399"
          />
        </motion.g>

        {/* Vessel nodes */}
        {vessels.map((vessel) => {
          const color = colors[vessel.status];

          return (
            <g
              key={vessel.id}
              onClick={() => setSelected(vessel)}
              style={{ cursor: 'pointer' }}
            >
              {/* Large invisible hit area */}
              <circle
                cx={vessel.x}
                cy={vessel.y}
                r="5"
                fill="transparent"
              />

              {/* Outer pulse */}
              <motion.circle
                cx={vessel.x}
                cy={vessel.y}
                r="2.8"
                fill="none"
                stroke={color}
                strokeWidth="0.25"
                animate={{
                  r: [2.5, 4.5, 2.5],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: vessel.x / 50,
                }}
              />

              {/* Node */}
              <circle
                cx={vessel.x}
                cy={vessel.y}
                r="1.8"
                fill="#07111d"
                stroke={color}
                strokeWidth="0.55"
                filter="url(#node-glow)"
              />

              {/* Core */}
              <circle
                cx={vessel.x}
                cy={vessel.y}
                r="0.65"
                fill={color}
              />

              {/* Heading line */}
              <line
                x1={vessel.x}
                y1={vessel.y - 2}
                x2={vessel.x}
                y2={vessel.y - 5}
                stroke={color}
                strokeWidth="0.25"
                opacity="0.7"
              />
            </g>
          );
        })}
      </svg>

      {/* Node labels */}
      {vessels.map((vessel) => {
        const color = colors[vessel.status];

        return (
          <button
            key={`label-${vessel.id}`}
            onClick={() => setSelected(vessel)}
            className="absolute z-10 text-left group"
            style={{
              left: `${vessel.x}%`,
              top: `${vessel.y}%`,
              transform: 'translate(8px, -8px)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] font-mono tracking-wide whitespace-nowrap transition-colors"
                style={{ color }}
              >
                {vessel.id}
              </span>

              <span className="text-[8px] font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                {vessel.efficiency}%
              </span>
            </div>
          </button>
        );
      })}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(16,185,129,.35), transparent)',
        }}
        animate={{
          top: ['15%', '90%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Bottom status bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between">

        <div className="flex items-center gap-4 text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
            OPTIMAL
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            ANOMALY
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
            PORT
          </div>
        </div>

        <span className="text-[9px] font-mono text-text-secondary">
          LATENCY 42ms
        </span>
      </div>

      {/* Selected vessel HUD */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className="absolute right-4 bottom-12 z-30 w-56 rounded-xl border border-white/10 bg-[#07111d]/95 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] text-text-secondary">
                VESSEL NODE
              </p>

              <p className="mt-1 font-display font-semibold text-sm text-text-primary">
                {selected.name}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="text-text-secondary hover:text-text-primary"
            >
              ×
            </button>
          </div>

          <div className="mt-4 space-y-3">

            <div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-text-secondary">
                  FUEL RESERVE
                </span>

                <span style={{ color: colors[selected.status] }}>
                  {selected.fuel}%
                </span>
              </div>

              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selected.fuel}%` }}
                  className="h-full rounded-full"
                  style={{
                    background: colors[selected.status],
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">

              <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
                <p className="text-[9px] text-text-secondary font-mono">
                  EFFICIENCY
                </p>

                <p className="mt-1 text-sm font-mono text-emerald">
                  {selected.efficiency}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
                <p className="text-[9px] text-text-secondary font-mono">
                  STATE
                </p>

                <p
                  className="mt-1 text-[10px] font-mono"
                  style={{
                    color: colors[selected.status],
                  }}
                >
                  {statusLabels[selected.status]}
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}