// Fuel types for maritime vessels
export type FuelType = 'VLSFO' | 'LNG' | 'methanol' | 'hydrogen' | 'ammonia';

export type VesselType = 'Tanker' | 'Bulk Carrier' | 'Container' | 'LNG Carrier' | 'Ferry' | 'RORO';

export type VesselStatus = 'active' | 'in-port' | 'maintenance';

export interface Vessel {
  id: string;
  name: string;
  type: VesselType;
  status: VesselStatus;
  fuelType: FuelType;
  shorePowerUsage: boolean;
  capacityTEU: number;        // TEU or DWT depending on type
  fuelEfficiencyScore: number; // 0-100
  currentSpeedKnots: number;
  fuelLevelPct: number;        // 0-100
  co2PerTonneNm: number;       // gCO2/tonne-nautical mile
  sparkline: number[];          // last 7 fuel consumption readings (tonnes)
}

export interface ConsumptionPoint {
  date: string;        // "MMM DD" e.g. "Jan 01"
  consumption: number; // tonnes/day
  target: number;
  forecast?: number;
}

export type WeatherCondition = 'calm' | 'moderate' | 'rough' | 'storm';
export type SailingStyle = 'eco' | 'standard' | 'performance';

export interface PredictionInput {
  vesselType: VesselType;
  distanceNm: number;
  loadFactor: number;     // 0-100 %
  speedKnots: number;     // 8-25 knots
  weather: WeatherCondition;
  sailingStyle: SailingStyle;
  fuelType: FuelType;
  hullFoulingPct: number; // 0-30 %
}

export interface PredictionResult extends PredictionInput {
  id: string;
  timestamp: string;
  predictedConsumptionTonnes: number;
  confidenceLow: number;
  confidenceHigh: number;
  co2Tonnes: number;
  costUSD: number;
  efficiencyScore: number; // 0-100
  featureImportance: {
    speed: number;
    load: number;
    weather: number;
    vesselType: number;
    fuelType: number;
    hullFouling: number;
  };
  tip: string;
}

export type OptimizationTarget = 'fuel' | 'cost' | 'emissions';
export type Algorithm = 'quantum-annealing' | 'qpso' | 'ga-baseline';

export interface OptimizationWeights {
  fuel: number; // 0-1
  cost: number; // 0-1
  ghg: number;  // 0-1 (lifecycle GHG)
}

export interface OptimizationResult {
  id: string;
  vesselIds: string[];
  algorithm: Algorithm;
  weights: OptimizationWeights;
  fuelSavingsPct: number;
  co2ReductionPct: number;
  costSavingsPct: number;
  convergenceIterations: number;
  recommendations: {
    vesselId: string;
    suggestedFuel: FuelType;
    speedKnots: number;
    note: string;
  }[];
  paretoPoints: {
    cost: number;
    emissions: number;
    efficiency: number;
    label: string;
  }[];
  before: {
    totalFuelTonnes: number;
    totalCostUSD: number;
    totalCo2Tonnes: number;
  };
  after: {
    totalFuelTonnes: number;
    totalCostUSD: number;
    totalCo2Tonnes: number;
  };
  constraintStatus: {
    cargoDemand: 'feasible' | 'violated';
    scheduleReliability: 'feasible' | 'violated';
    emissionCap: 'feasible' | 'violated';
  };
}

export interface BenchmarkEntry {
  rank: number;
  name: string;
  method: 'Quantum Annealing' | 'QPSO' | 'GA' | 'Simulated Annealing' | 'Random Search';
  accuracyMAPE: number;         // %
  convergenceIterations: number;
  solutionQuality: number;      // 0-100
  runtimeMs200: number;         // runtime at 200 vessels in ms
  radarScores: {
    accuracy: number;
    convergenceSpeed: number;
    solutionQuality: number;
    scalability: number;
    robustness: number;
  };
  trend: number[];              // 12-month solution quality scores
  scalabilityPoints: {
    fleetSize: number;
    runtimeMs: number;
  }[];
}

export interface Alert {
  id: string;
  vesselId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}
