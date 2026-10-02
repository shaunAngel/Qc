import type { PredictionInput, PredictionResult, VesselType, FuelType, WeatherCondition, SailingStyle } from '@/types';

// ── Lookup tables ─────────────────────────────────────────────────────────────

/** Base consumption (tonnes per 1 000 nm) at 12 knots, 50 % load, calm, standard */
const BASE_BY_TYPE: Record<VesselType, number> = {
  'Tanker': 45,
  'Bulk Carrier': 38,
  'Container': 52,
  'LNG Carrier': 40,
  'Ferry': 28,
  'RORO': 35,
};

const WEATHER_FACTOR: Record<WeatherCondition, number> = {
  calm: 1.00,
  moderate: 1.08,
  rough: 1.18,
  storm: 1.35,
};

const SAILING_FACTOR: Record<SailingStyle, number> = {
  eco: 0.88,
  standard: 1.00,
  performance: 1.15,
};

/** Energy-density / combustion-efficiency relative factor */
const FUEL_FACTOR: Record<FuelType, number> = {
  VLSFO: 1.00,
  LNG: 0.82,
  methanol: 1.12,
  hydrogen: 0.65,
  ammonia: 0.90,
};

/** kg CO₂ per tonne of fuel burned (lifecycle / combustion) */
const CARBON_INTENSITY: Record<FuelType, number> = {
  VLSFO: 3.15,
  LNG: 2.75,
  methanol: 0.45,
  hydrogen: 0.00,
  ammonia: 0.00,
};

/** USD per tonne of fuel */
const FUEL_PRICE: Record<FuelType, number> = {
  VLSFO: 650,
  LNG: 720,
  methanol: 890,
  hydrogen: 2100,
  ammonia: 480,
};

/** Human-readable tips keyed by the dominant cost driver */
const TIPS: Record<string, string> = {
  speed:
    'Reducing speed by 1 knot can cut fuel consumption by up to 10 %. Consider slow steaming on this route.',
  load:
    'Optimising cargo distribution improves trim and reduces resistance — target 85–90 % load factor.',
  weather:
    'Route around the adverse weather system. A 50–80 nm detour could save more fuel than fighting the headwind.',
  vesselType:
    'For this vessel class, hull-cleaning intervals under 18 months yield the best efficiency returns.',
  fuelType:
    'Switching to LNG for this voyage profile would reduce CO₂ output by ≈ 13 % vs VLSFO.',
  hullFouling:
    'Hull fouling above 15 % adds significant drag. Schedule a dry-dock cleaning to recover efficiency.',
};

// ── Core deterministic formula ────────────────────────────────────────────────

/**
 * Predict fuel consumption for a given voyage input.
 * Fully deterministic — no Math.random() calls.
 */
export function predictFuelConsumption(input: PredictionInput): PredictionResult {
  const {
    vesselType,
    distanceNm,
    loadFactor,
    speedKnots,
    weather,
    sailingStyle,
    fuelType,
    hullFoulingPct,
  } = input;

  // Individual multipliers
  const base = BASE_BY_TYPE[vesselType];
  const speedFactor = Math.pow(speedKnots / 12, 2.5);
  const loadFactorMul = 0.7 + (loadFactor / 100) * 0.3;
  const weatherFactor = WEATHER_FACTOR[weather];
  const sailingMul = SAILING_FACTOR[sailingStyle];
  const fuelMul = FUEL_FACTOR[fuelType];
  const hullFactor = 1 + hullFoulingPct * 0.006;

  const rawConsumption =
    base *
    speedFactor *
    loadFactorMul *
    weatherFactor *
    sailingMul *
    fuelMul *
    hullFactor *
    (distanceNm / 1000);

  const predictedConsumptionTonnes = Math.round(rawConsumption * 100) / 100;

  // Confidence interval: ±6 % deterministic band
  const confidenceLow = Math.round(predictedConsumptionTonnes * 0.94 * 100) / 100;
  const confidenceHigh = Math.round(predictedConsumptionTonnes * 1.06 * 100) / 100;

  const co2Tonnes =
    Math.round(predictedConsumptionTonnes * CARBON_INTENSITY[fuelType] * 100) / 100;

  const costUSD =
    Math.round(predictedConsumptionTonnes * FUEL_PRICE[fuelType] * 100) / 100;

  // Efficiency score: relative to best-case (eco + calm + min fouling) for this vessel/fuel
  const bestCase =
    base *
    Math.pow(speedKnots / 12, 2.5) *
    (0.7 + (loadFactor / 100) * 0.3) *
    1.00 *  // calm
    0.88 *  // eco
    fuelMul *
    1.00 *  // no fouling
    (distanceNm / 1000);

  const worstCase =
    base *
    Math.pow(speedKnots / 12, 2.5) *
    (0.7 + (loadFactor / 100) * 0.3) *
    1.35 *  // storm
    1.15 *  // performance
    fuelMul *
    (1 + 30 * 0.006) *
    (distanceNm / 1000);

  const range = worstCase - bestCase;
  const efficiencyScore =
    range > 0
      ? Math.min(100, Math.max(0, Math.round(100 - ((rawConsumption - bestCase) / range) * 80)))
      : 80;

  // Feature importance: magnitude of each multiplier's deviation from neutral (1.0)
  const deviations = {
    speed: Math.abs(speedFactor - 1),
    load: Math.abs(loadFactorMul - 1),
    weather: Math.abs(weatherFactor - 1),
    vesselType: Math.abs(base / 40 - 1),   // 40 = median base
    fuelType: Math.abs(fuelMul - 1),
    hullFouling: Math.abs(hullFactor - 1),
  };
  const totalDev = Object.values(deviations).reduce((s, v) => s + v, 0) || 1;
  const featureImportance = {
    speed: Math.round((deviations.speed / totalDev) * 100) / 100,
    load: Math.round((deviations.load / totalDev) * 100) / 100,
    weather: Math.round((deviations.weather / totalDev) * 100) / 100,
    vesselType: Math.round((deviations.vesselType / totalDev) * 100) / 100,
    fuelType: Math.round((deviations.fuelType / totalDev) * 100) / 100,
    hullFouling: Math.round((deviations.hullFouling / totalDev) * 100) / 100,
  };

  // Tip: based on the dominant cost factor
  const dominantKey = (Object.keys(deviations) as (keyof typeof deviations)[]).reduce(
    (a, b) => (deviations[a] > deviations[b] ? a : b)
  );
  const tip = TIPS[dominantKey] ?? TIPS['speed'];

  // Deterministic ID derived from input values (no random)
  const id = `pred-${vesselType.slice(0, 3).toLowerCase()}-${Math.round(distanceNm)}-${Math.round(speedKnots * 10)}`;
  const timestamp = '2025-01-15T10:00:00Z'; // fixed for determinism in history; callers override for live

  return {
    ...input,
    id,
    timestamp,
    predictedConsumptionTonnes,
    confidenceLow,
    confidenceHigh,
    co2Tonnes,
    costUSD,
    efficiencyScore,
    featureImportance,
    tip,
  };
}

// ── Pre-seeded history ────────────────────────────────────────────────────────

const makeHistoryEntry = (
  id: string,
  timestamp: string,
  input: PredictionInput
): PredictionResult => {
  const result = predictFuelConsumption(input);
  return { ...result, id, timestamp };
};

export const predictionHistory: PredictionResult[] = [
  makeHistoryEntry('hist-001', '2025-01-10T08:22:00Z', {
    vesselType: 'Container',
    distanceNm: 3200,
    loadFactor: 88,
    speedKnots: 18,
    weather: 'moderate',
    sailingStyle: 'standard',
    fuelType: 'LNG',
    hullFoulingPct: 5,
  }),
  makeHistoryEntry('hist-002', '2025-01-11T14:05:00Z', {
    vesselType: 'Tanker',
    distanceNm: 4800,
    loadFactor: 95,
    speedKnots: 14,
    weather: 'rough',
    sailingStyle: 'eco',
    fuelType: 'VLSFO',
    hullFoulingPct: 12,
  }),
  makeHistoryEntry('hist-003', '2025-01-12T09:47:00Z', {
    vesselType: 'Bulk Carrier',
    distanceNm: 2600,
    loadFactor: 70,
    speedKnots: 12,
    weather: 'calm',
    sailingStyle: 'standard',
    fuelType: 'methanol',
    hullFoulingPct: 8,
  }),
  makeHistoryEntry('hist-004', '2025-01-13T16:30:00Z', {
    vesselType: 'LNG Carrier',
    distanceNm: 5500,
    loadFactor: 80,
    speedKnots: 16,
    weather: 'moderate',
    sailingStyle: 'performance',
    fuelType: 'LNG',
    hullFoulingPct: 3,
  }),
  makeHistoryEntry('hist-005', '2025-01-14T11:15:00Z', {
    vesselType: 'Ferry',
    distanceNm: 800,
    loadFactor: 60,
    speedKnots: 15,
    weather: 'calm',
    sailingStyle: 'eco',
    fuelType: 'hydrogen',
    hullFoulingPct: 2,
  }),
];
