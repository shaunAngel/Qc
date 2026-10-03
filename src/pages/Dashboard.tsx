import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

import { fleet } from '@/data/fleet';
import { consumptionSeries } from '@/data/consumption';
import { alerts } from '@/data/alerts';

import { GlassCard } from '@/components/ui/GlassCard';
import { KPICard } from '@/components/ui/KPICard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import { AreaChartWrapper } from '@/components/charts/AreaChartWrapper';
import { DigitalTwin } from '@/components/charts/DigitalTwin';
import { QuantumOrb } from '@/components/animations/QuantumOrb';
import { DecisionStream } from '@/components/ui/DecisionStream';

import { CHART_THEME } from '@/lib/chartTheme';

import type { Alert, Vessel } from '@/types';

// ─── Animation variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 28,
    },
  },
};

// ─── Fuel mix data ──────────────────────────────────────────────────────────

const fuelMixData = [
  {
    name: 'VLSFO',
    value: 3,
    color: 'var(--color-amber)',
  },
  {
    name: 'LNG',
    value: 3,
    color: 'var(--color-cyan)',
  },
  {
    name: 'Methanol',
    value: 2,
    color: 'var(--color-emerald)',
  },
  {
    name: 'Hydrogen',
    value: 2,
    color: 'var(--color-emerald-light)',
  },
  {
    name: 'Ammonia',
    value: 2,
    color: 'var(--color-coral)',
  },
  {
    name: 'Shore Power',
    value: 4,
    color: 'var(--color-text-secondary)',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();

  const hours = Math.floor(diff / 3_600_000);

  if (hours < 1) {
    return 'Just now';
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function truncate(str: string, n: number): string {
  return str.length <= n
    ? str
    : str.slice(0, n) + '…';
}

const severityOrder: Record<Alert['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const sortedAlerts = [...alerts].sort(
  (a, b) =>
    severityOrder[a.severity] -
    severityOrder[b.severity],
);

const severityBadgeVariant: Record<
  Alert['severity'],
  'coral' | 'amber' | 'cyan'
> = {
  critical: 'coral',
  warning: 'amber',
  info: 'cyan',
};

const statusBadgeVariant: Record<
  Vessel['status'],
  'emerald' | 'cyan' | 'amber'
> = {
  active: 'emerald',
  'in-port': 'cyan',
  maintenance: 'amber',
};

function fuelLevelColor(pct: number): string {
  if (pct > 60) {
    return 'bg-emerald';
  }

  if (pct > 30) {
    return 'bg-amber';
  }

  return 'bg-coral';
}

// ─── Mini sparkline ─────────────────────────────────────────────────────────

function Sparkline({
  values,
}: {
  values: number[];
}) {
  const W = 56;
  const H = 32;

  if (!values.length) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = W / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = H - ((v - min) / range) * H;

    return `${x},${y}`;
  });

  return (
    <svg
      width={W}
      height={H}
      className="overflow-visible"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#10B981"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Fuel mix tooltip ──────────────────────────────────────────────────────

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: {
      color: string;
    };
  }[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const {
    name,
    value,
    payload: p,
  } = payload[0];

  return (
    <div
      style={CHART_THEME.tooltip.contentStyle}
      className="text-xs px-3 py-2"
    >
      <span style={{ color: p.color }}>
        {name}
      </span>

      <span className="ml-2 font-mono text-text-primary">
        {value} vessel{value !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Dashboard
// ═══════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base text-text-primary">

      {/* ═══════════════════════════════════════════════════════════════
          HERO — QUANTUM COMMAND CENTER
      ═══════════════════════════════════════════════════════════════ */}

      <section className="relative min-h-[72vh] flex items-center overflow-hidden">

        {/* Technical background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(16,185,129,0.035) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(16,185,129,0.035) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(circle at center, black, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black, transparent 80%)',
          }}
        />

        {/* Ambient green light */}
        <div
          className="absolute left-1/4 top-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,.08), transparent 65%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Ambient cyan light */}
        <div
          className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,.07), transparent 65%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-10">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">

            {/* ── Hero copy ─────────────────────────────────────────── */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >

              {/* System badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/5 px-3 py-1.5">

                <span className="relative flex h-1.5 w-1.5">

                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      rounded-full
                      bg-emerald
                      animate-ping
                      opacity-75
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-emerald
                    "
                  />

                </span>

                <span className="font-mono text-[9px] tracking-[0.16em] text-emerald">
                  QUANTA CORE // ONLINE
                </span>

              </div>

              {/* Main heading */}
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[0.95] tracking-tight">

                <span className="text-text-primary">
                  Predict.
                </span>

                <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald via-cyan to-emerald">
                  Optimize.
                </span>

                <br />

                <span className="text-text-primary">
                  Navigate.
                </span>

              </h1>

              <p className="mt-7 max-w-xl text-base lg:text-lg leading-relaxed text-text-secondary">
                Quantum-inspired fleet intelligence that
                turns live telemetry into predictive fuel
                decisions.
              </p>

              {/* Live telemetry */}
              <div className="mt-8 grid grid-cols-3 max-w-lg border-y border-white/[0.06] py-4">

                <div>
                  <p className="text-[9px] font-mono text-text-secondary">
                    ACTIVE NODES
                  </p>

                  <p className="mt-1 font-mono text-lg text-text-primary">
                    06
                    <span className="text-text-secondary text-xs">
                      /06
                    </span>
                  </p>
                </div>

                <div className="border-l border-white/[0.06] pl-5">
                  <p className="text-[9px] font-mono text-text-secondary">
                    DATA STREAM
                  </p>

                  <p className="mt-1 font-mono text-lg text-cyan">
                    184/s
                  </p>
                </div>

                <div className="border-l border-white/[0.06] pl-5">
                  <p className="text-[9px] font-mono text-text-secondary">
                    LATENCY
                  </p>

                  <p className="mt-1 font-mono text-lg text-emerald">
                    42ms
                  </p>
                </div>

              </div>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-3">

                <Button
                  variant="primary"
                  onClick={() =>
                    navigate('/optimizer')
                  }
                  className="px-6 py-3"
                >
                  Open Optimizer
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate('/predictor')
                  }
                  className="px-6 py-3"
                >
                  Run Prediction
                </Button>

              </div>

            </motion.div>

            {/* ── Quantum Core ──────────────────────────────────────── */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.75,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 0.25,
                type: 'spring',
                stiffness: 80,
              }}
              className="flex justify-center"
            >

              <div className="relative">

                {/* Outer technical ring */}
                <motion.div
                  className="absolute inset-[-30px] rounded-full border border-emerald/10"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Outer dashed ring */}
                <motion.div
                  className="absolute inset-[-55px] rounded-full border border-cyan/5 border-dashed"
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 45,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                <QuantumOrb
                  size={330}
                  score={87.4}
                />

                {/* Core title */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.25em] text-text-secondary whitespace-nowrap">
                  QUANTUM CORE
                </div>

                {/* Core status */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono tracking-[0.18em] text-emerald">
                  OPTIMIZATION ENGINE ACTIVE
                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════════════ */}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">

        {/* ═══════════════════════════════════════════════════════════
            KPI STRIP
        ═══════════════════════════════════════════════════════════ */}

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: '-60px',
          }}
        >

          <motion.div variants={itemVariants}>
            <KPICard
              label="Total Vessels"
              value={12}
              unit="vessels"
              accent="cyan"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 21c.6.5 1.2 1 2.5 1C7 22 7 20 9.5 20c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                  <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                  <path d="M12 10v4" />
                  <path d="M8 13h8" />
                </svg>
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              label="Fleet Efficiency"
              value={78.5}
              unit="/100"
              delta="+2.3%"
              deltaPositive
              accent="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              label="CO₂ Saved"
              value="1,240"
              unit="t CO₂"
              delta="-8.4%"
              deltaPositive
              accent="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              label="Schedule Reliability"
              value={94.2}
              unit="%"
              delta="+1.1%"
              deltaPositive
              accent="amber"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              label="Cargo Demand Met"
              value={97.8}
              unit="%"
              accent="cyan"
            />
          </motion.div>

        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            CONSUMPTION + FUEL MIX
        ═══════════════════════════════════════════════════════════ */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Fleet consumption */}
          <GlassCard className="lg:col-span-2 p-5">

            <div className="mb-4">

              <h2 className="font-display font-semibold text-base text-text-primary">
                Fleet Fuel Consumption
              </h2>

              <p className="text-text-secondary text-xs mt-0.5">
                30-day rolling window
              </p>

            </div>

            <AreaChartWrapper
              data={
                consumptionSeries as unknown as Record<
                  string,
                  unknown
                >[]
              }
              dataKeys={[
                {
                  key: 'consumption',
                  color: '#10B981',
                  name: 'Actual',
                },
                {
                  key: 'target',
                  color: '#94A3B8',
                  name: 'Target',
                },
                {
                  key: 'forecast',
                  color: '#06B6D4',
                  name: 'Forecast',
                },
              ]}
              xDataKey="date"
              height={220}
            />

          </GlassCard>

          {/* Fuel mix */}
          <GlassCard className="p-5 flex flex-col">

            <div className="mb-4">

              <h2 className="font-display font-semibold text-base text-text-primary">
                Fleet Fuel Mix
              </h2>

              <p className="text-text-secondary text-xs mt-0.5">
                Current fleet composition
              </p>

            </div>

            <div className="flex-1">

              <ResponsiveContainer
                width="100%"
                height={180}
              >
                <PieChart>

                  <Pie
                    data={fuelMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >

                    {fuelMixData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                      />
                    ))}

                  </Pie>

                  <RechartsTooltip
                    content={
                      <DonutTooltip />
                    }
                  />

                </PieChart>
              </ResponsiveContainer>

            </div>

            {/* Legend */}
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">

              {fuelMixData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5"
                >

                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{
                      background: item.color,
                    }}
                  />

                  <span className="text-xs font-body text-text-secondary truncate">
                    {item.name}

                    <span className="text-text-primary font-mono ml-1">
                      {item.value}
                    </span>
                  </span>

                </div>
              ))}

            </div>

          </GlassCard>

        </div>

        {/* ═══════════════════════════════════════════════════════════
            DIGITAL TWIN
        ═══════════════════════════════════════════════════════════ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          <GlassCard className="p-5">

            <div className="flex items-start justify-between mb-4">

              <div>

                <div className="flex items-center gap-2">

                  <span className="relative flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald animate-ping opacity-75" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />

                  </span>

                  <h2 className="font-display font-semibold text-base text-text-primary">
                    Fleet Digital Twin
                  </h2>

                </div>

                <p className="text-text-secondary text-xs mt-1">
                  Live vessel state, energy flow & telemetry
                </p>

              </div>

              <div className="text-right">

                <p className="text-[9px] font-mono text-text-secondary">
                  SYSTEM STATE
                </p>

                <p className="text-xs font-mono text-emerald mt-1">
                  SYNCHRONIZED
                </p>

              </div>

            </div>

            <div className="h-[500px] bg-overlay rounded-xl border border-border overflow-hidden">
              <DigitalTwin />
            </div>

          </GlassCard>

        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            INTELLIGENCE LAYER
        ═══════════════════════════════════════════════════════════ */}

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">

          {/* System intelligence */}
          <GlassCard className="p-6 relative overflow-hidden">

            {/* Ambient glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(16,185,129,.08), transparent 70%)',
              }}
            />

            <div className="relative">

              <div className="flex items-center gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald/10 border border-emerald/20">
                  <span className="text-emerald font-mono text-xs">
                    λ
                  </span>
                </span>

                <div>

                  <h2 className="font-display font-semibold text-base">
                    System Intelligence
                  </h2>

                  <p className="text-[9px] font-mono tracking-wider text-text-secondary">
                    WHY QUANTA IS ACTING
                  </p>

                </div>

              </div>

              <div className="mt-7">

                <p className="text-sm leading-relaxed text-text-secondary max-w-xl">
                  Quanta continuously evaluates fleet
                  telemetry, predicts demand shifts and
                  searches for lower-cost operating states.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

                    <p className="text-[9px] font-mono text-text-secondary">
                      STATES EVALUATED
                    </p>

                    <p className="mt-2 text-2xl font-mono text-cyan">
                      1,284
                    </p>

                    <p className="mt-1 text-[10px] text-text-secondary">
                      candidate configurations
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

                    <p className="text-[9px] font-mono text-text-secondary">
                      EXPECTED SAVINGS
                    </p>

                    <p className="mt-2 text-2xl font-mono text-emerald">
                      18.7%
                    </p>

                    <p className="mt-1 text-[10px] text-text-secondary">
                      current optimization
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </GlassCard>

          {/* AI decision stream */}
          <DecisionStream />

        </div>

        {/* ═══════════════════════════════════════════════════════════
            ALERTS
        ═══════════════════════════════════════════════════════════ */}

        <GlassCard className="p-5">

          <div className="flex items-center gap-3 mb-4">

            <h2 className="font-display font-semibold text-base text-text-primary">
              Fleet Alerts
            </h2>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-coral/20 text-coral border border-coral/30">
              {alerts.length}
            </span>

          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">

            {sortedAlerts.map((alert) => (

              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border hover:border-emerald/50 transition-colors"
              >

                <div className="shrink-0 pt-0.5">

                  <Badge
                    label={alert.severity.toUpperCase()}
                    variant={
                      severityBadgeVariant[
                        alert.severity
                      ]
                    }
                  />

                </div>

                <p className="text-sm font-body text-text-secondary leading-snug flex-1 min-w-0">
                  {truncate(alert.message, 80)}
                </p>

                <span className="shrink-0 text-xs font-mono text-text-secondary/60 whitespace-nowrap">
                  {formatRelativeTime(
                    alert.timestamp,
                  )}
                </span>

              </div>

            ))}

          </div>

        </GlassCard>

        {/* ═══════════════════════════════════════════════════════════
            VESSEL FLEET
        ═══════════════════════════════════════════════════════════ */}

        <div>

          <div className="flex items-end justify-between mb-4">

            <div>

              <h2 className="font-display font-semibold text-lg text-text-primary">
                Vessel Fleet Status
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Current operational state across the fleet
              </p>

            </div>

            <span className="text-[9px] font-mono text-text-secondary">
              {fleet.length.toString().padStart(2, '0')} NODES
            </span>

          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              margin: '-80px',
            }}
          >

            {fleet.map((vessel) => (

              <motion.div
                key={vessel.id}
                variants={itemVariants}
              >

                <GlassCard
                  className="p-4 h-full flex flex-col gap-3"
                  animate
                  accent="none"
                >

                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2">

                    <span className="text-xs font-mono text-text-secondary">
                      {vessel.id}
                    </span>

                    <Badge
                      label={
                        vessel.status === 'in-port'
                          ? 'IN PORT'
                          : vessel.status.toUpperCase()
                      }
                      variant={
                        statusBadgeVariant[
                          vessel.status
                        ]
                      }
                    />

                  </div>

                  {/* Vessel name */}
                  <div className="flex items-center gap-1.5">

                    <p className="font-display font-semibold text-sm text-text-primary leading-tight flex-1">
                      {vessel.name}
                    </p>

                    {vessel.shorePowerUsage && (
                      <span
                        title="Shore power active"
                        className="text-cyan shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M13 2 L4.5 13.5 H11 L11 22 L19.5 10.5 H13 Z" />
                        </svg>
                      </span>
                    )}

                  </div>

                  {/* Vessel metadata */}
                  <div className="flex items-center gap-2 flex-wrap">

                    <span className="text-text-secondary text-xs font-body">
                      {vessel.type}
                    </span>

                    <span className="text-text-secondary/40 text-xs">
                      ·
                    </span>

                    <Badge
                      label={vessel.fuelType}
                      variant={
                        vessel.fuelType === 'LNG'
                          ? 'cyan'
                          : vessel.fuelType === 'VLSFO'
                            ? 'amber'
                            : vessel.fuelType === 'methanol'
                              ? 'emerald'
                              : vessel.fuelType === 'hydrogen'
                                ? 'emerald'
                                : 'coral'
                      }
                    />

                  </div>

                  {/* Fuel level */}
                  <div>

                    <div className="flex justify-between items-center mb-1">

                      <span className="text-xs font-body text-text-secondary">
                        Fuel Level
                      </span>

                      <span className="text-xs font-mono text-text-primary">
                        {vessel.fuelLevelPct}%
                      </span>

                    </div>

                    <div className="h-1.5 w-full rounded-full bg-overlay overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all ${fuelLevelColor(
                          vessel.fuelLevelPct,
                        )}`}
                        style={{
                          width: `${vessel.fuelLevelPct}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-auto pt-1">

                    <div>

                      <span className="text-xs font-body text-text-secondary">
                        Efficiency{' '}
                      </span>

                      <span className="text-xs font-mono text-text-primary">
                        {vessel.fuelEfficiencyScore}/100
                      </span>

                    </div>

                    <Sparkline
                      values={
                        vessel.sparkline ??
                        vessel.sparkline ??
                        []
                      }
                    />

                  </div>

                </GlassCard>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </div>

    </div>
  );
}