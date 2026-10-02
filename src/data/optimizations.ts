import type {
  Algorithm,
  FuelType,
  OptimizationResult,
  OptimizationWeights,
  VesselType,
} from '@/types';
import { fleet } from './fleet';

// ── Fuel characteristics for scoring ─────────────────────────────────────────

/** Relative cost factor per tonne of fuel (VLSFO = 1.0 baseline) */
const FUEL_COST_FACTOR: Record<FuelType, number> = {
  VLSFO: 1.00,
  LNG: 1.11,
  methanol: 1.37,
  hydrogen: 3.23,
  ammonia: 0.74,
};

/** CO₂ intensity factor (lower = greener; VLSFO = 1.0 baseline) */
const FUEL_EMISSION_FACTOR: Record<FuelType, number> = {
  VLSFO: 1.00,
  LNG: 0.87,
  methanol: 0.14,
  hydrogen: 0.00,
  ammonia: 0.00,
};

/** Efficiency (energy content / engine compatibility) — higher = better */
const FUEL_EFFICIENCY_FACTOR: Record<FuelType, number> = {
  VLSFO: 1.00,
  LNG: 1.10,
  methanol: 0.85,
  hydrogen: 1.20,
  ammonia: 0.95,
};

const ALL_FUELS: FuelType[] = ['VLSFO', 'LNG', 'methanol', 'hydrogen', 'ammonia'];

/** Vessel-type fuel compatibility (0 = incompatible, 1 = native, 0.8 = retrofittable) */
const TYPE_FUEL_COMPAT: Record<VesselType, Partial<Record<FuelType, number>>> = {
  'Tanker': { VLSFO: 1, LNG: 0.8, methanol: 0.8, hydrogen: 0.6, ammonia: 0.7 },
  'Bulk Carrier': { VLSFO: 1, LNG: 0.8, methanol: 0.7, hydrogen: 0.5, ammonia: 0.6 },
  'Container': { VLSFO: 1, LNG: 1, methanol: 0.8, hydrogen: 0.7, ammonia: 0.6 },
  'LNG Carrier': { VLSFO: 0.9, LNG: 1, methanol: 0.7, hydrogen: 0.6, ammonia: 0.5 },
  'Ferry': { VLSFO: 0.9, LNG: 0.9, methanol: 0.8, hydrogen: 1, ammonia: 0.7 },
  'RORO': { VLSFO: 1, LNG: 0.8, methanol: 0.8, hydrogen: 0.6, ammonia: 0.7 },
};

/** Convergence iterations by algorithm */
const ALGORITHM_ITERATIONS: Record<Algorithm, number> = {
  'quantum-annealing': 87,
  'qpso': 124,
  'ga-baseline': 312,
};

/** Notes for fuel recommendations */
const FUEL_NOTES: Record<FuelType, string> = {
  VLSFO: 'Maintain current VLSFO operations — lowest infrastructure change.',
  LNG: 'Transition to LNG reduces CO₂ by ~13 %. Bunkering available at major ports.',
  methanol: 'Green methanol cuts lifecycle GHG by ~86 %. Dual-fuel retrofit recommended.',
  hydrogen: 'Zero-emission voyage possible. Hydrogen bunkering infrastructure required.',
  ammonia: 'Ammonia offers zero CO₂ at competitive cost. NOx scrubber required.',
};

// ── Deterministic optimization engine ────────────────────────────────────────

/**
 * Score a fuel for a vessel given optimization weights.
 * Returns a score where higher = better recommendation.
 */
function scoreFuel(
  vesselType: VesselType,
  fuel: FuelType,
  weights: OptimizationWeights
): number {
  const compat = TYPE_FUEL_COMPAT[vesselType][fuel] ?? 0;
  if (compat === 0) return -Infinity;

  // Lower cost = better, so invert
  const costScore = (1 / FUEL_COST_FACTOR[fuel]) * weights.cost;
  // Lower emissions = better, so invert (add small epsilon to avoid /0)
  const emissionScore = (1 / (FUEL_EMISSION_FACTOR[fuel] + 0.01)) * weights.ghg;
  const efficiencyScore = FUEL_EFFICIENCY_FACTOR[fuel] * weights.fuel;

  return (costScore + emissionScore + efficiencyScore) * compat;
}

/**
 * Run a deterministic fleet optimization.
 * Scores all 5 fuels per vessel and recommends the top-scoring option.
 * Generates 15 Pareto-front points distributed across cost/emissions space.
 */
export function runOptimization(
  vesselIds: string[],
  weights: OptimizationWeights,
  algorithm: Algorithm
): OptimizationResult {
  const vessels = fleet.filter((v) => vesselIds.includes(v.id));

  // Per-vessel fuel recommendations
  const recommendations = vessels.map((vessel) => {
    const scores = ALL_FUELS.map((fuel) => ({
      fuel,
      score: scoreFuel(vessel.type, fuel, weights),
    }));
    scores.sort((a, b) => b.score - a.score);
    const suggested = scores[0].fuel;
    // Recommended speed: slightly reduced for eco emphasis
    const speedKnots =
      vessel.currentSpeedKnots > 0
        ? Math.max(10, Math.round((vessel.currentSpeedKnots * 0.92) * 10) / 10)
        : 12;

    return {
      vesselId: vessel.id,
      suggestedFuel: suggested,
      speedKnots,
      note: FUEL_NOTES[suggested],
    };
  });

  // Aggregate before/after numbers
  const avgFuelEfficiency = vessels.length > 0
    ? vessels.reduce((s, v) => s + v.fuelEfficiencyScore, 0) / vessels.length
    : 70;

  // Rough "before" daily totals per vessel (use sparkline average as proxy)
  const beforeFuelTonnes = vessels.reduce((s, v) => {
    const avg = v.sparkline.reduce((a, b) => a + b, 0) / v.sparkline.length;
    return s + avg;
  }, 0);

  // Savings driven by algorithm quality
  const algorithmSavingsFactor =
    algorithm === 'quantum-annealing' ? 0.18
    : algorithm === 'qpso' ? 0.13
    : 0.08;

  const weightedSavings =
    algorithmSavingsFactor *
    (0.4 * weights.fuel + 0.3 * weights.cost + 0.3 * weights.ghg) *
    3; // scale to realistic %

  const fuelSavingsPct = Math.round(weightedSavings * 100 * 10) / 10;
  const co2ReductionPct = Math.round((weightedSavings * 1.15) * 100 * 10) / 10;
  const costSavingsPct = Math.round((weightedSavings * 0.9) * 100 * 10) / 10;

  const afterFuelTonnes = Math.round(beforeFuelTonnes * (1 - weightedSavings) * 100) / 100;
  const costPerTonne = 700; // blended fleet average USD/tonne
  const carbonPerTonne = 2.8; // blended CO₂ tonne/tonne fuel

  const before = {
    totalFuelTonnes: Math.round(beforeFuelTonnes * 100) / 100,
    totalCostUSD: Math.round(beforeFuelTonnes * costPerTonne),
    totalCo2Tonnes: Math.round(beforeFuelTonnes * carbonPerTonne * 100) / 100,
  };
  const after = {
    totalFuelTonnes: afterFuelTonnes,
    totalCostUSD: Math.round(afterFuelTonnes * costPerTonne),
    totalCo2Tonnes: Math.round(afterFuelTonnes * carbonPerTonne * 100) / 100,
  };

  // Pareto front: 15 points spread across cost vs emissions trade-off space
  const paretoPoints = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14; // 0..1
    // Trade-off curve: lower cost = higher emissions, lower emissions = higher cost
    const cost = Math.round((before.totalCostUSD * (0.75 + t * 0.20)) / 1000) * 1000;
    const emissions = Math.round(before.totalCo2Tonnes * (0.60 + (1 - t) * 0.35) * 10) / 10;
    const efficiency = Math.round(avgFuelEfficiency * (0.85 + t * 0.10));
    return {
      cost,
      emissions,
      efficiency,
      label: `Config ${String.fromCharCode(65 + i)}`,
    };
  });

  // Constraint status: feasibility based on savings achieved
  const constraintStatus = {
    cargoDemand: 'feasible' as const,
    scheduleReliability: fuelSavingsPct > 15 ? 'feasible' as const : 'feasible' as const,
    emissionCap: co2ReductionPct >= 10 ? 'feasible' as const : 'violated' as const,
  };

  const id = `opt-${algorithm.slice(0, 2)}-${vesselIds.length}-${Date.now()}`;

  return {
    id,
    vesselIds,
    algorithm,
    weights,
    fuelSavingsPct,
    co2ReductionPct,
    costSavingsPct,
    convergenceIterations: ALGORITHM_ITERATIONS[algorithm],
    recommendations,
    paretoPoints,
    before,
    after,
    constraintStatus,
  };
}

// ── Optimization presets ──────────────────────────────────────────────────────

export function getOptimizationPresets(): { label: string; weights: OptimizationWeights }[] {
  return [
    {
      label: 'Maximum Fuel Savings',
      weights: { fuel: 0.80, cost: 0.10, ghg: 0.10 },
    },
    {
      label: 'Minimum Cost',
      weights: { fuel: 0.10, cost: 0.80, ghg: 0.10 },
    },
    {
      label: 'Net-Zero Focus',
      weights: { fuel: 0.10, cost: 0.10, ghg: 0.80 },
    },
    {
      label: 'Balanced Optimisation',
      weights: { fuel: 0.33, cost: 0.34, ghg: 0.33 },
    },
    {
      label: 'IMO 2030 Compliance',
      weights: { fuel: 0.25, cost: 0.25, ghg: 0.50 },
    },
  ];
}
