import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuantumOrb } from '@/components/animations/QuantumOrb';
import { BarChartWrapper } from '@/components/charts/BarChartWrapper';
import { predictFuelConsumption, predictionHistory as seedHistory } from '@/data/predictions';
import { CHART_THEME } from '@/lib/chartTheme';
import type { PredictionInput, PredictionResult } from '@/types';

// ── Shared input style ────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-surface border border-white/[0.08] rounded-xl px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-cyan/50';

const labelClass = 'text-xs font-medium text-text-secondary uppercase tracking-wider';

// ── Custom tooltip for the what-if LineChart ──────────────────────────────────

function WhatIfTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_THEME.tooltip.contentStyle}>
      <p className="text-xs font-medium text-text-secondary mb-1">{label} kn</p>
      <p className="text-xs font-mono text-emerald">
        {(payload[0].value as number).toFixed(2)} t
      </p>
    </div>
  );
}

// ── Field row helper ──────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Predictor() {
  const [input, setInput] = useState<PredictionInput>({
    vesselType: 'Container',
    distanceNm: 3000,
    loadFactor: 75,
    speedKnots: 16,
    weather: 'moderate',
    sailingStyle: 'standard',
    fuelType: 'LNG',
    hullFoulingPct: 8,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [sessionHistory, setSessionHistory] = useState<PredictionResult[]>([]);

  function handleChange<K extends keyof PredictionInput>(key: K, value: PredictionInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleRunPrediction() {
    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const prediction = predictFuelConsumption({
        ...input,
        // live timestamp override
      } as PredictionInput);
      const live: PredictionResult = {
        ...prediction,
        timestamp: new Date().toISOString(),
      };
      setResult(live);
      setSessionHistory((prev) => [live, ...prev]);
      setIsLoading(false);
    }, 2000);
  }

  // Speed-vs-consumption what-if curve — recomputes live from `input` state
  const whatIfData = useMemo(() => {
    const points: { speed: string; consumption: number }[] = [];
    for (let s = 8; s <= 25; s += 2) {
      const r = predictFuelConsumption({ ...input, speedKnots: s });
      points.push({ speed: s.toFixed(1), consumption: r.predictedConsumptionTonnes });
    }
    return points;
  }, [input]);

  // Feature importance data (only available once result exists)
  const featureImportanceData = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.featureImportance).map(([key, val]) => ({
      feature: key,
      importance: +(val * 100).toFixed(1),
    }));
  }, [result]);

  // Combined history: session first, then seed (deduped by id)
  const allHistory = useMemo(() => {
    const sessionIds = new Set(sessionHistory.map((r) => r.id));
    const deduped = seedHistory.filter((r) => !sessionIds.has(r.id));
    return [...sessionHistory, ...deduped];
  }, [sessionHistory]);

  return (
    <div className="min-h-screen bg-base pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <h1 className="font-display text-2xl font-semibold text-text-primary">
            Fuel Predictor
          </h1>
          <Badge label="QUANTUM ANNEALING" variant="cyan" />
        </motion.div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT: Input Form ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassCard className="p-6 space-y-5">
              <h2 className="font-display text-base font-semibold text-text-primary">
                Prediction Inputs
              </h2>

              {/* Vessel Type */}
              <FieldRow label="Vessel Type">
                <select
                  className={inputClass}
                  value={input.vesselType}
                  onChange={(e) => handleChange('vesselType', e.target.value as PredictionInput['vesselType'])}
                >
                  {(['Tanker', 'Bulk Carrier', 'Container', 'LNG Carrier', 'Ferry', 'RORO'] as const).map(
                    (t) => <option key={t} value={t}>{t}</option>
                  )}
                </select>
              </FieldRow>

              {/* Fuel Type */}
              <FieldRow label="Fuel Type">
                <select
                  className={inputClass}
                  value={input.fuelType}
                  onChange={(e) => handleChange('fuelType', e.target.value as PredictionInput['fuelType'])}
                >
                  {(['VLSFO', 'LNG', 'methanol', 'hydrogen', 'ammonia'] as const).map(
                    (f) => <option key={f} value={f}>{f}</option>
                  )}
                </select>
              </FieldRow>

              {/* Route Distance */}
              <FieldRow label={`Route Distance — ${input.distanceNm} nm`}>
                <input
                  type="number"
                  className={inputClass}
                  min={100}
                  max={20000}
                  value={input.distanceNm}
                  onChange={(e) => handleChange('distanceNm', Number(e.target.value))}
                />
              </FieldRow>

              {/* Speed slider — drives live what-if curve */}
              <FieldRow label={`Speed — ${input.speedKnots} knots`}>
                <input
                  type="range"
                  min={8}
                  max={25}
                  step={0.5}
                  value={input.speedKnots}
                  onChange={(e) => handleChange('speedKnots', Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#10B981' }}
                />
                <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
                  <span>8 kn</span>
                  <span>25 kn</span>
                </div>
              </FieldRow>

              {/* Load Factor slider */}
              <FieldRow label={`Load Factor — ${input.loadFactor}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={input.loadFactor}
                  onChange={(e) => handleChange('loadFactor', Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#10B981' }}
                />
                <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </FieldRow>

              {/* Hull Fouling slider */}
              <FieldRow label={`Hull Fouling — ${input.hullFoulingPct}%`}>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={input.hullFoulingPct}
                  onChange={(e) => handleChange('hullFoulingPct', Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#10B981' }}
                />
                <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </FieldRow>

              {/* Weather */}
              <FieldRow label="Weather">
                <select
                  className={inputClass}
                  value={input.weather}
                  onChange={(e) => handleChange('weather', e.target.value as PredictionInput['weather'])}
                >
                  {(['calm', 'moderate', 'rough', 'storm'] as const).map(
                    (w) => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
                  )}
                </select>
              </FieldRow>

              {/* Sailing Style */}
              <FieldRow label="Sailing Style">
                <select
                  className={inputClass}
                  value={input.sailingStyle}
                  onChange={(e) => handleChange('sailingStyle', e.target.value as PredictionInput['sailingStyle'])}
                >
                  {(['eco', 'standard', 'performance'] as const).map(
                    (s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  )}
                </select>
              </FieldRow>

              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={handleRunPrediction}
                disabled={isLoading}
              >
                {isLoading ? 'Computing…' : 'Run Prediction'}
              </Button>
            </GlassCard>
          </motion.div>

          {/* ── RIGHT: Results Panel ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Loading state */}
            {isLoading && (
              <GlassCard className="p-8 flex flex-col items-center justify-center gap-4 min-h-[280px]">
                <QuantumOrb size={120} />
                <p className="text-text-secondary text-sm font-body animate-pulse">
                  Computing quantum prediction…
                </p>
              </GlassCard>
            )}

            {/* Empty state */}
            {!isLoading && !result && (
              <GlassCard className="p-8 flex flex-col items-center justify-center gap-3 min-h-[280px]">
                <div className="text-4xl opacity-30">⚡</div>
                <p className="text-text-secondary text-sm text-center">
                  Configure your voyage parameters and run a prediction to see results here.
                </p>
              </GlassCard>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
              {!isLoading && result && (
                <motion.div
                  key={result.id + result.timestamp}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Primary result card */}
                  <GlassCard accent="emerald" animate className="p-6 space-y-4">
                    <div className="flex items-end gap-2">
                      <span className="font-mono text-4xl font-bold text-emerald leading-none">
                        {result.predictedConsumptionTonnes.toFixed(1)}
                      </span>
                      <span className="text-text-secondary text-sm mb-1">tonnes</span>
                    </div>

                    <p className="font-mono text-sm text-cyan">
                      Confidence: {result.confidenceLow} – {result.confidenceHigh} t
                    </p>

                    {/* KPI grid */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="space-y-0.5">
                        <p className={labelClass}>CO₂</p>
                        <p className="font-mono text-sm text-coral font-medium">
                          {result.co2Tonnes} t
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className={labelClass}>Cost</p>
                        <p className="font-mono text-sm text-amber font-medium">
                          ${result.costUSD.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className={labelClass}>Efficiency</p>
                        <p className="font-mono text-sm text-emerald font-medium">
                          {result.efficiencyScore}/100
                        </p>
                      </div>
                    </div>

                    <p className="text-text-secondary text-xs italic border-t border-white/[0.06] pt-3">
                      💡 {result.tip}
                    </p>
                  </GlassCard>

                  {/* Speed vs Consumption what-if curve */}
                  <GlassCard className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-text-primary">
                        Speed vs Consumption
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        What-if analysis at current settings
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={whatIfData}
                        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={CHART_THEME.gridColor}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="speed"
                          tick={CHART_THEME.axis.tick}
                          axisLine={CHART_THEME.axis.line}
                          tickLine={false}
                          label={{
                            value: 'knots',
                            position: 'insideBottomRight',
                            offset: -4,
                            fill: '#94A3B8',
                            fontSize: 10,
                          }}
                        />
                        <YAxis
                          tick={CHART_THEME.axis.tick}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<WhatIfTooltip />} />
                        <ReferenceLine
                          x={input.speedKnots.toFixed(1)}
                          stroke="#F59E0B"
                          strokeDasharray="4 3"
                          label={{
                            value: `${input.speedKnots} kn`,
                            position: 'top',
                            fill: '#F59E0B',
                            fontSize: 10,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="consumption"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#10B981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </GlassCard>

                  {/* Feature Importance */}
                  <GlassCard className="p-5 space-y-3">
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      Feature Importance
                    </h3>
                    <BarChartWrapper
                      data={featureImportanceData}
                      bars={[{ key: 'importance', color: '#06B6D4', name: 'Importance %' }]}
                      xDataKey="feature"
                      layout="vertical"
                      height={200}
                    />
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* What-if curve while no result yet (live from slider) */}
            {!isLoading && !result && (
              <GlassCard className="p-5 space-y-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-text-primary">
                    Speed vs Consumption
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    What-if preview — adjust sliders to explore
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={whatIfData}
                    margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={CHART_THEME.gridColor}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="speed"
                      tick={CHART_THEME.axis.tick}
                      axisLine={CHART_THEME.axis.line}
                      tickLine={false}
                    />
                    <YAxis tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
                    <Tooltip content={<WhatIfTooltip />} />
                    <ReferenceLine
                      x={input.speedKnots.toFixed(1)}
                      stroke="#F59E0B"
                      strokeDasharray="4 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            )}
          </motion.div>
        </div>

        {/* ── Model Card Row ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <GlassCard className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <h3 className="font-display text-sm font-semibold text-text-primary whitespace-nowrap">
                  Model Performance
                </h3>
                <Badge label="QUANTUM-VALIDATED" variant="cyan" />
              </div>
              <div className="grid grid-cols-3 gap-6 sm:gap-12">
                <div className="space-y-0.5 text-center">
                  <p className="font-mono text-xl font-bold text-emerald">2.3%</p>
                  <p className={labelClass}>Mean Absolute % Error</p>
                  <p className="text-[10px] text-text-secondary">MAPE</p>
                </div>
                <div className="space-y-0.5 text-center">
                  <p className="font-mono text-xl font-bold text-cyan">12.4 t</p>
                  <p className={labelClass}>Root Mean Sq. Error</p>
                  <p className="text-[10px] text-text-secondary">RMSE</p>
                </div>
                <div className="space-y-0.5 text-center">
                  <p className="font-mono text-xl font-bold text-amber">0.967</p>
                  <p className={labelClass}>Coefficient of Determination</p>
                  <p className="text-[10px] text-text-secondary">R²</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── History Table ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="font-display text-sm font-semibold text-text-primary">
                Prediction History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Timestamp', 'Vessel Type', 'Distance', 'Predicted (t)', 'Efficiency'].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {allHistory.map((entry, idx) => (
                    <tr
                      key={entry.id + entry.timestamp}
                      className={idx % 2 === 0 ? 'bg-white/[0.02]' : ''}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 text-text-primary text-xs">
                        {entry.vesselType}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                        {entry.distanceNm.toLocaleString()} nm
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-emerald font-medium">
                        {entry.predictedConsumptionTonnes.toFixed(1)} t
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[64px]">
                            <div
                              className="h-full bg-emerald rounded-full"
                              style={{ width: `${entry.efficiencyScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-text-secondary">
                            {entry.efficiencyScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
