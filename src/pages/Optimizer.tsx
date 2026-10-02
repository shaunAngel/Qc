import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TooltipProps } from 'recharts';
import { fleet } from '@/data/fleet';
import { runOptimization } from '@/data/optimizations';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { NodeGraph } from '@/components/animations/NodeGraph';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';
import { ScatterChartWrapper } from '@/components/charts/ScatterChartWrapper';
import type {
  Algorithm,
  FuelType,
  OptimizationResult,
  OptimizationWeights,
} from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'scanning' | 'converging' | 'resolving' | 'done';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALGORITHMS: { id: Algorithm; label: string; description: string }[] = [
  {
    id: 'quantum-annealing',
    label: 'Quantum Annealing-Inspired',
    description: 'Lowest convergence iterations, best solution quality.',
  },
  {
    id: 'qpso',
    label: 'QPSO',
    description: 'Quantum Particle Swarm — strong multi-objective balance.',
  },
  {
    id: 'ga-baseline',
    label: 'GA Baseline',
    description: 'Genetic algorithm reference — reliable but slower.',
  },
];

const FUEL_COLORS: Record<FuelType, string> = {
  VLSFO: '#94A3B8',
  LNG: '#06B6D4',
  methanol: '#10B981',
  hydrogen: '#F59E0B',
  ammonia: '#F87171',
};

const FUEL_BADGE_VARIANT: Record<FuelType, 'gray' | 'cyan' | 'emerald' | 'amber' | 'coral'> = {
  VLSFO: 'gray',
  LNG: 'cyan',
  methanol: 'emerald',
  hydrogen: 'amber',
  ammonia: 'coral',
};

const PHASE_LABEL: Record<Exclude<Phase, 'idle'>, string> = {
  scanning: 'Scanning vessel configurations...',
  converging: 'Quantum convergence in progress...',
  resolving: 'Resolving optimal solution...',
  done: 'Optimization complete!',
};

// ─── Pareto tooltip ───────────────────────────────────────────────────────────

function ParetoTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const pt = payload[0]?.payload as {
    cost: number;
    emissions: number;
    efficiency: number;
    label: string;
  } | undefined;
  if (!pt) return null;
  return (
    <div
      style={{
        backgroundColor: '#0A1628',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#F1F5F9',
      }}
      className="p-3 min-w-[160px]"
    >
      <p className="text-xs font-medium text-text-secondary mb-1">{pt.label}</p>
      <p className="text-xs font-mono text-cyan">
        Cost: <span className="text-text-primary">${(pt.cost / 1000).toFixed(0)}k</span>
      </p>
      <p className="text-xs font-mono text-emerald">
        Emissions: <span className="text-text-primary">{pt.emissions} t</span>
      </p>
      <p className="text-xs font-mono text-amber">
        Efficiency: <span className="text-text-primary">{pt.efficiency}</span>
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Optimizer() {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    fleet.map((v) => v.id).slice(0, 6)
  );
  const [weights, setWeights] = useState<OptimizationWeights>({
    fuel: 0.33,
    cost: 0.34,
    ghg: 0.33,
  });
  const [algorithm, setAlgorithm] = useState<Algorithm>('quantum-annealing');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showToast, setShowToast] = useState(false);

  const isRunning = phase !== 'idle';

  // ── Vessel selection ──────────────────────────────────────────────────────

  function toggleVessel(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSelectedIds(fleet.map((v) => v.id));
  }

  function clearAll() {
    setSelectedIds([]);
  }

  // ── Weight sliders ────────────────────────────────────────────────────────

  function setWeight(key: keyof OptimizationWeights, value: number) {
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  const weightTotal = weights.fuel + weights.cost + weights.ghg || 1;

  // ── Run optimization ──────────────────────────────────────────────────────

  function handleRun() {
    if (selectedIds.length === 0 || isRunning) return;
    setResult(null);
    setPhase('scanning');

    setTimeout(() => setPhase('converging'), 1200);
    setTimeout(() => setPhase('resolving'), 2600);
    setTimeout(() => {
      const optimized = runOptimization(selectedIds, weights, algorithm);
      setResult(optimized);
      setPhase('done');
      setTimeout(() => setPhase('idle'), 600);
    }, 3500);
  }

  // ── Apply plan ────────────────────────────────────────────────────────────

  function handleApplyPlan() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  // ── Bar chart data ────────────────────────────────────────────────────────

  const barData = result
    ? [
        {
          group: 'Fuel (t)',
          before: result.before.totalFuelTonnes,
          after: result.after.totalFuelTonnes,
        },
        {
          group: 'Cost ($k)',
          before: Math.round(result.before.totalCostUSD / 1000),
          after: Math.round(result.after.totalCostUSD / 1000),
        },
        {
          group: 'CO₂ (t)',
          before: result.before.totalCo2Tonnes,
          after: result.after.totalCo2Tonnes,
        },
      ]
    : [];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-base px-4 py-8 md:px-8 text-text-primary">
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-text-primary">
          Optimizer Studio
        </h1>
        <p className="text-text-secondary text-sm mt-1 font-body">
          Configure fleet parameters and run quantum-inspired optimizations.
        </p>
      </div>

      {/* ── Configuration grid ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="show"
      >
        {/* ── Column 1: Vessel Selector ── */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Select Vessels</h2>
            <span className="bg-white/10 text-text-secondary text-xs font-mono px-2 py-0.5 rounded-full border border-white/10">
              {selectedIds.length}/12
            </span>
          </div>

          {/* Vessel cards */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {fleet.map((vessel) => {
              const isSelected = selectedIds.includes(vessel.id);
              const shortName = vessel.name.split(' ').slice(0, 2).join(' ');
              return (
                <button
                  key={vessel.id}
                  onClick={() => toggleVessel(vessel.id)}
                  className={`cursor-pointer rounded-xl border p-2.5 text-xs transition-all text-left ${
                    isSelected
                      ? 'border-emerald/50 bg-emerald/10 text-emerald'
                      : 'border-white/[0.08] bg-white/[0.02] text-text-secondary hover:border-white/20'
                  }`}
                >
                  <p className="font-medium truncate">{shortName}</p>
                  <p className={`mt-0.5 truncate ${isSelected ? 'text-emerald/70' : 'text-text-secondary/70'}`}>
                    {vessel.type}
                  </p>
                  <div className="mt-1.5">
                    <Badge label={vessel.fuelType} variant={FUEL_BADGE_VARIANT[vessel.fuelType]} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Select all / clear */}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={selectAll} className="text-xs px-3 py-1 flex-1">
              Select All
            </Button>
            <Button variant="ghost" onClick={clearAll} className="text-xs px-3 py-1 flex-1">
              Clear
            </Button>
          </div>
        </GlassCard>
        </motion.div>

        {/* ── Column 2: Objectives & Constraints ── */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
        <GlassCard className="p-5">
          <h2 className="font-display text-base font-semibold mb-4">
            Optimization Objectives
          </h2>

          {/* Weight sliders */}
          <div className="space-y-5">
            {/* Fuel Weight */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-body text-text-primary">
                  ⚡ Fuel Savings
                </label>
                <span className="text-xs font-mono text-emerald">
                  {(weights.fuel * 100).toFixed(0)}%
                  <span className="text-text-secondary ml-1">
                    ({Math.round((weights.fuel / weightTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.fuel}
                onChange={(e) => setWeight('fuel', parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-emerald"
                style={{ background: `linear-gradient(to right, #10B981 ${weights.fuel * 100}%, rgba(255,255,255,0.1) ${weights.fuel * 100}%)` }}
              />
            </div>

            {/* Cost Weight */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-body text-text-primary">
                  💰 Cost Reduction
                </label>
                <span className="text-xs font-mono text-amber">
                  {(weights.cost * 100).toFixed(0)}%
                  <span className="text-text-secondary ml-1">
                    ({Math.round((weights.cost / weightTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.cost}
                onChange={(e) => setWeight('cost', parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-amber"
                style={{ background: `linear-gradient(to right, #F59E0B ${weights.cost * 100}%, rgba(255,255,255,0.1) ${weights.cost * 100}%)` }}
              />
            </div>

            {/* GHG Weight */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-body text-text-primary">
                  🌿 Lifecycle GHG
                </label>
                <span className="text-xs font-mono text-emerald-light">
                  {(weights.ghg * 100).toFixed(0)}%
                  <span className="text-text-secondary ml-1">
                    ({Math.round((weights.ghg / weightTotal) * 100)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.ghg}
                onChange={(e) => setWeight('ghg', parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #34D399 ${weights.ghg * 100}%, rgba(255,255,255,0.1) ${weights.ghg * 100}%)` }}
              />
            </div>
          </div>

          {/* Constraint Status */}
          <div className="mt-6">
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
              Constraint Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Cargo Demand */}
              <ConstraintChip
                label="Cargo Demand"
                status={result?.constraintStatus.cargoDemand ?? 'feasible'}
              />
              {/* Schedule Reliability */}
              <ConstraintChip
                label="Schedule Reliability"
                status={result?.constraintStatus.scheduleReliability ?? 'feasible'}
              />
              {/* Emission Cap */}
              <ConstraintChip
                label="Emission Cap"
                status={result?.constraintStatus.emissionCap ?? 'feasible'}
              />
            </div>
          </div>
        </GlassCard>
        </motion.div>

        {/* ── Column 3: Algorithm & Fuel Toggles ── */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
        <GlassCard className="p-5 flex flex-col">
          <h2 className="font-display text-base font-semibold mb-4">
            Algorithm Selection
          </h2>

          {/* Algorithm cards */}
          <div className="space-y-2 mb-6">
            {ALGORITHMS.map((algo) => {
              const isSelected = algorithm === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id)}
                  className={`w-full text-left rounded-xl border p-3 text-xs transition-all ${
                    isSelected
                      ? 'border-cyan/50 bg-cyan/10 text-cyan'
                      : 'border-white/[0.08] bg-white/[0.02] text-text-secondary hover:border-white/20'
                  }`}
                >
                  <p className={`font-medium text-sm ${isSelected ? 'text-cyan' : 'text-text-primary'}`}>
                    {algo.label}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">{algo.description}</p>
                </button>
              );
            })}
          </div>

          {/* Alternative Fuels */}
          <div className="mb-5">
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Alternative Fuels
            </h3>
            <FuelToggles />
          </div>

          {/* Shore Power */}
          <div className="mb-6">
            <ShorePowerToggle />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Run button */}
          <div>
            {selectedIds.length === 0 && (
              <p className="text-coral text-xs mb-2 font-body">
                Select at least one vessel to run the optimizer.
              </p>
            )}
            <Button
              variant="primary"
              onClick={handleRun}
              disabled={selectedIds.length === 0 || isRunning}
              className="w-full"
            >
              {isRunning ? 'Running...' : 'Run Optimizer'}
            </Button>
          </div>
        </GlassCard>
        </motion.div>
      </motion.div>

      {/* ── Animation overlay ── */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            key="animation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base/80 backdrop-blur-sm"
          >
            <NodeGraph phase={phase} className="mb-6" />
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`font-display text-lg font-medium ${
                phase === 'done' ? 'text-emerald' : 'text-text-primary'
              }`}
            >
              {PHASE_LABEL[phase]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results section ── */}
      <AnimatePresence>
        {result && phase === 'idle' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-8 space-y-6"
          >
            {/* Results summary cards */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display text-xl font-semibold">Results</h2>
                <Badge
                  label={ALGORITHMS.find((a) => a.id === result.algorithm)?.label ?? result.algorithm}
                  variant="cyan"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultMetricCard
                  label="Fuel Savings"
                  value={`${result.fuelSavingsPct}%`}
                  color="text-emerald"
                  accent="emerald"
                />
                <ResultMetricCard
                  label="CO₂ Reduction"
                  value={`${result.co2ReductionPct}%`}
                  color="text-emerald"
                  accent="emerald"
                />
                <ResultMetricCard
                  label="Cost Savings"
                  value={`${result.costSavingsPct}%`}
                  color="text-amber"
                  accent="amber"
                />
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Before/After Bar Chart */}
              <GlassCard className="p-5">
                <h3 className="font-display text-sm font-semibold mb-4">
                  Before vs After Comparison
                </h3>
                <BarChartWrapper
                  data={barData}
                  xDataKey="group"
                  bars={[
                    { key: 'before', name: 'Before', color: 'rgba(248,113,113,0.5)' },
                    { key: 'after', name: 'After', color: '#10B981' },
                  ]}
                  height={240}
                />
              </GlassCard>

              {/* Pareto Frontier Scatter */}
              <GlassCard className="p-5">
                <h3 className="font-display text-sm font-semibold mb-1">
                  Pareto Frontier
                </h3>
                <p className="text-text-secondary text-xs mb-4">
                  Hover a point to see fleet configuration
                </p>
                <ScatterChartWrapper
                  data={result.paretoPoints as unknown as Record<string, unknown>[]}
                  xKey="cost"
                  yKey="emissions"
                  customTooltip={ParetoTooltip}
                  height={220}
                />
              </GlassCard>
            </div>

            {/* Recommendations Table */}
            <GlassCard className="p-5">
              <h3 className="font-display text-sm font-semibold mb-4">
                Vessel Recommendations
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-body">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-text-secondary font-medium py-2 pr-4">Vessel</th>
                      <th className="text-left text-text-secondary font-medium py-2 pr-4">Suggested Fuel</th>
                      <th className="text-left text-text-secondary font-medium py-2 pr-4">Speed (kn)</th>
                      <th className="text-left text-text-secondary font-medium py-2">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.recommendations.map((rec) => {
                      const vessel = fleet.find((v) => v.id === rec.vesselId);
                      return (
                        <tr
                          key={rec.vesselId}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-2.5 pr-4 font-medium text-text-primary">
                            {vessel?.name ?? rec.vesselId}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
                              style={{
                                color: FUEL_COLORS[rec.suggestedFuel],
                                borderColor: `${FUEL_COLORS[rec.suggestedFuel]}40`,
                                backgroundColor: `${FUEL_COLORS[rec.suggestedFuel]}18`,
                              }}
                            >
                              {rec.suggestedFuel}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 font-mono text-text-primary">
                            {rec.speedKnots} kn
                          </td>
                          <td className="py-2.5 text-text-secondary leading-relaxed max-w-xs">
                            {rec.note}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Apply Plan button */}
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={handleApplyPlan}>
                  Apply Plan
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Apply Plan Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl border border-emerald/40 bg-surface px-5 py-3 shadow-glow-emerald"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <span className="text-emerald text-base">✓</span>
            <span className="text-sm font-body text-text-primary">
              Optimization plan applied to fleet
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function ConstraintChip({
  label,
  status,
}: {
  label: string;
  status: 'feasible' | 'violated';
}) {
  const isFeasible = status === 'feasible';
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-body border ${
        isFeasible
          ? 'bg-emerald/20 text-emerald border-emerald/30'
          : 'bg-coral/20 text-coral border-coral/30'
      }`}
    >
      {isFeasible ? '✓' : '✗'} {label}
    </span>
  );
}

function ResultMetricCard({
  label,
  value,
  color,
  accent,
}: {
  label: string;
  value: string;
  color: string;
  accent: 'emerald' | 'amber' | 'cyan';
}) {
  const glowClass: Record<string, string> = {
    emerald: 'shadow-glow-emerald',
    amber: 'shadow-glow-amber',
    cyan: 'shadow-glow-cyan',
  };
  return (
    <div
      className={`rounded-xl border p-5 ${glowClass[accent]}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-text-secondary text-xs font-body mb-2">{label}</p>
      <p className={`font-mono text-3xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

// Stateful sub-components for fuel toggles & shore power

const ALL_FUELS: FuelType[] = ['VLSFO', 'LNG', 'methanol', 'hydrogen', 'ammonia'];

function FuelToggles() {
  const [active, setActive] = useState<FuelType[]>(['LNG', 'methanol', 'hydrogen']);

  function toggle(fuel: FuelType) {
    setActive((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_FUELS.map((fuel) => {
        const isActive = active.includes(fuel);
        const color = FUEL_COLORS[fuel];
        return (
          <button
            key={fuel}
            onClick={() => toggle(fuel)}
            className="rounded-full px-3 py-1 text-xs font-body border transition-all"
            style={
              isActive
                ? {
                    backgroundColor: `${color}25`,
                    borderColor: `${color}60`,
                    color,
                  }
                : {
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#94A3B8',
                  }
            }
          >
            {fuel}
          </button>
        );
      })}
    </div>
  );
}

function ShorePowerToggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled((v) => !v)}
      className={`flex items-center justify-between w-full rounded-xl border px-4 py-3 transition-all ${
        enabled
          ? 'border-cyan/40 bg-cyan/10'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
      }`}
    >
      <span className={`text-sm font-body ${enabled ? 'text-cyan' : 'text-text-secondary'}`}>
        ⚡ Shore Power
      </span>
      {/* Toggle pill */}
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${
          enabled ? 'bg-cyan/70' : 'bg-white/10'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
          animate={{ left: enabled ? '1.375rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
    </button>
  );
}
