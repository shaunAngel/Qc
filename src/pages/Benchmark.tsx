import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

import { benchmarks } from '@/data/benchmarks';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { LineChartWrapper } from '@/components/charts/LineChartWrapper';
import { RadarChartWrapper } from '@/components/charts/RadarChartWrapper';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

// ─── Types & constants ────────────────────────────────────────────────────

type SortKey = 'solutionQuality' | 'convergenceIterations' | 'accuracyMAPE' | 'runtimeMs200';

interface PanelVisibility {
  p1: boolean;
  p2: boolean;
  p3: boolean;
  p4: boolean;
}

// Per-method color assignment (stable, index-based in original order)
const METHOD_COLORS: Record<string, string> = {
  'Quantum Annealing': CHART_COLORS.emerald,
  'QPSO':              CHART_COLORS.cyan,
  'Genetic Algorithm': CHART_COLORS.amber,
  'Simulated Annealing': CHART_COLORS.coral,
  'Random Search':     '#EF4444', // red-500
};

// Tailwind-safe panel animation
const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const verdictVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  show:   { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Custom tooltip for accuracy bar chart ────────────────────────────────

function AccuracyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_THEME.tooltip.contentStyle} className="px-3 py-2">
      <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
      <p className="text-xs font-mono" style={{ color: payload[0]?.fill ?? CHART_COLORS.emerald }}>
        MAPE: {payload[0]?.value}%
      </p>
    </div>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────

function Panel({
  visible,
  title,
  subtitle,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={title}
          variants={panelVariants}
          initial="hidden"
          animate="show"
        >
          <GlassCard className="p-5 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="font-display font-semibold text-base text-text-primary">{title}</h3>
              <p className="text-text-secondary text-xs mt-0.5">{subtitle}</p>
            </div>
            <div className="flex-1">{children}</div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Benchmark Arena Page
// ═══════════════════════════════════════════════════════════════════════════

export default function Benchmark() {
  const [panelsVisible, setPanelsVisible] = useState<PanelVisibility>({
    p1: true,
    p2: true,
    p3: true,
    p4: true,
  });
  const [showVerdict, setShowVerdict] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('solutionQuality');

  // ── Sort ───────────────────────────────────────────────────────────────

  const sortedBenchmarks = [...benchmarks].sort((a, b) => {
    // For MAPE and convergenceIterations, lower is better → ascending
    // For solutionQuality, higher is better → descending
    if (sortKey === 'accuracyMAPE' || sortKey === 'convergenceIterations' || sortKey === 'runtimeMs200') {
      return a[sortKey] - b[sortKey];
    }
    return b[sortKey] - a[sortKey];
  });

  // ── Run benchmark ──────────────────────────────────────────────────────

  function handleRunBenchmark() {
    setIsRunning(true);
    setShowVerdict(false);
    setPanelsVisible({ p1: false, p2: false, p3: false, p4: false });

    setTimeout(() => setPanelsVisible((v) => ({ ...v, p1: true })), 0);
    setTimeout(() => setPanelsVisible((v) => ({ ...v, p2: true })), 800);
    setTimeout(() => setPanelsVisible((v) => ({ ...v, p3: true })), 1600);
    setTimeout(() => setPanelsVisible((v) => ({ ...v, p4: true })), 2400);
    setTimeout(() => {
      setIsRunning(false);
      setShowVerdict(true);
    }, 3200);
  }

  // ── Panel 1: Accuracy ─────────────────────────────────────────────────
  // Per-bar coloring via Cell — we render directly with Recharts primitives

  const accuracyData = sortedBenchmarks.map((b) => ({
    method: b.name.split(' ')[0],
    mape: b.accuracyMAPE,
    fullName: b.name,
  }));

  // ── Panel 2: Convergence Speed (12-month trend lines) ─────────────────

  const trendData = Array.from({ length: 12 }, (_, i) => {
    const point: Record<string, number | string> = { month: `M${i + 1}` };
    sortedBenchmarks.forEach((b) => {
      point[b.name] = b.trend[i];
    });
    return point;
  });

  const trendLines = sortedBenchmarks.map((b) => ({
    key: b.name,
    name: b.name,
    color: METHOD_COLORS[b.name],
  }));

  // ── Panel 3: Solution Quality (radar) ─────────────────────────────────
  // Top 3 methods

  const top3 = benchmarks.filter((b) => b.rank <= 3); // always QA, QPSO, GA by rank

  const radarData = [
    { subject: 'Accuracy',         ...Object.fromEntries(top3.map((b) => [b.name, b.radarScores.accuracy])) },
    { subject: 'Convergence',      ...Object.fromEntries(top3.map((b) => [b.name, b.radarScores.convergenceSpeed])) },
    { subject: 'Solution Quality', ...Object.fromEntries(top3.map((b) => [b.name, b.radarScores.solutionQuality])) },
    { subject: 'Scalability',      ...Object.fromEntries(top3.map((b) => [b.name, b.radarScores.scalability])) },
    { subject: 'Robustness',       ...Object.fromEntries(top3.map((b) => [b.name, b.radarScores.robustness])) },
  ] as { subject: string; [key: string]: number | string }[];

  const radarKeys = top3.map((b) => ({
    key: b.name,
    name: b.name,
    color: METHOD_COLORS[b.name],
  }));

  // ── Panel 4: Scalability (runtime vs fleet size, log scale) ───────────

  const fleetSizes = [10, 25, 50, 100, 200, 300, 500];

  const scalabilityData = fleetSizes.map((size) => {
    const point: Record<string, number | string> = { fleetSize: size };
    sortedBenchmarks.forEach((b) => {
      const found = b.scalabilityPoints.find((p) => p.fleetSize === size);
      if (found) point[b.name] = found.runtimeMs;
    });
    return point;
  });

  const scalabilityLines = sortedBenchmarks.map((b) => ({
    key: b.name,
    name: b.name,
    color: METHOD_COLORS[b.name],
  }));

  // ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-base text-text-primary">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Benchmark Arena
            </h1>
            <p className="text-text-secondary text-sm mt-1 font-body">
              Quantum-inspired vs conventional methods
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort control */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="
                rounded-xl border border-white/10 bg-surface text-text-secondary text-sm
                font-body px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan/50
                hover:border-white/20 transition-colors cursor-pointer
              "
            >
              <option value="solutionQuality">Sort by: Solution Quality</option>
              <option value="convergenceIterations">Sort by: Convergence Speed</option>
              <option value="accuracyMAPE">Sort by: Accuracy (MAPE)</option>
              <option value="runtimeMs200">Sort by: Scalability</option>
            </select>

            {/* Run Benchmark button */}
            <Button
              variant="primary"
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="whitespace-nowrap"
            >
              {isRunning ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⟳
                  </motion.span>
                  Running…
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Run Benchmark
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* ── 2×2 Panel Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Panel 1 — Accuracy */}
          <Panel
            visible={panelsVisible.p1}
            title="Prediction Accuracy"
            subtitle="Mean Absolute Percentage Error (MAPE)"
          >
            <p className="text-xs font-mono text-text-secondary mb-3">
              Lower is better ↓
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={accuracyData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_THEME.gridColor}
                  vertical={false}
                />
                <XAxis
                  dataKey="method"
                  tick={CHART_THEME.axis.tick}
                  axisLine={CHART_THEME.axis.line}
                  tickLine={false}
                />
                <YAxis
                  tick={CHART_THEME.axis.tick}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <RechartsTooltip
                  content={
                    <AccuracyTooltip />
                  }
                />
                <Bar dataKey="mape" name="MAPE %" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {accuracyData.map((entry) => (
                    <Cell
                      key={entry.fullName}
                      fill={METHOD_COLORS[entry.fullName] ?? CHART_COLORS.emerald}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          {/* Panel 2 — Convergence Speed */}
          <Panel
            visible={panelsVisible.p2}
            title="Convergence Speed"
            subtitle="Iterations to optimal solution"
          >
            <LineChartWrapper
              data={trendData}
              lines={trendLines}
              xDataKey="month"
              height={260}
            />
          </Panel>

          {/* Panel 3 — Solution Quality */}
          <Panel
            visible={panelsVisible.p3}
            title="Solution Quality"
            subtitle="Multi-dimensional performance radar"
          >
            <RadarChartWrapper
              data={radarData}
              keys={radarKeys}
              height={280}
            />
          </Panel>

          {/* Panel 4 — Scalability */}
          <Panel
            visible={panelsVisible.p4}
            title="Scalability"
            subtitle="Runtime vs fleet size (log scale)"
          >
            <LineChartWrapper
              data={scalabilityData}
              lines={scalabilityLines}
              xDataKey="fleetSize"
              height={260}
              yAxisScale="log"
            />
          </Panel>
        </div>

        {/* ── Verdict Banner ───────────────────────────────────────────── */}
        <AnimatePresence>
          {showVerdict && (
            <motion.div
              key="verdict"
              variants={verdictVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 8, transition: { duration: 0.3 } }}
              className="
                rounded-2xl border border-emerald/30
                bg-gradient-to-r from-emerald/10 to-cyan/10
                p-6 flex flex-col sm:flex-row sm:items-center gap-4
              "
            >
              {/* Icon */}
              <span
                className="text-3xl shrink-0 self-start sm:self-center"
                aria-label="lightning bolt"
              >
                ⚡
              </span>

              {/* Text block */}
              <div>
                <p className="font-mono text-xs text-emerald uppercase tracking-widest mb-1">
                  Verdict
                </p>
                <p className="font-display text-xl font-bold text-text-primary leading-snug">
                  Quantum-inspired converges 3.2× faster at 200 vessels
                </p>
                <p className="text-text-secondary text-sm mt-1 font-body">
                  achieving 24% better solution quality than GA baseline
                </p>
              </div>

              {/* Metrics strip */}
              <div className="sm:ml-auto flex gap-6 shrink-0 flex-wrap">
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-emerald">3.2×</p>
                  <p className="text-xs font-body text-text-secondary">Faster Convergence</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-cyan">24%</p>
                  <p className="text-xs font-body text-text-secondary">Better Quality</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-amber">2.3%</p>
                  <p className="text-xs font-body text-text-secondary">MAPE (QA)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
