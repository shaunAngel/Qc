import type { BenchmarkEntry } from '@/types';

export const benchmarks: BenchmarkEntry[] = [
  // ── 1. Quantum Annealing ────────────────────────────────────────────────────
  {
    rank: 1,
    name: 'Quantum Annealing',
    method: 'Quantum Annealing',
    accuracyMAPE: 2.3,
    convergenceIterations: 87,
    solutionQuality: 94,
    runtimeMs200: 1240,
    radarScores: {
      accuracy: 94,
      convergenceSpeed: 92,
      solutionQuality: 94,
      scalability: 88,
      robustness: 90,
    },
    // 12-month trend: started strong, improved further with model updates
    trend: [86, 87, 88, 89, 90, 90, 91, 92, 93, 93, 94, 94],
    scalabilityPoints: [
      { fleetSize: 10,  runtimeMs: 42 },
      { fleetSize: 25,  runtimeMs: 98 },
      { fleetSize: 50,  runtimeMs: 198 },
      { fleetSize: 100, runtimeMs: 420 },
      { fleetSize: 200, runtimeMs: 1240 },
      { fleetSize: 300, runtimeMs: 2100 },
      { fleetSize: 500, runtimeMs: 4200 },
    ],
  },

  // ── 2. QPSO ────────────────────────────────────────────────────────────────
  {
    rank: 2,
    name: 'QPSO',
    method: 'QPSO',
    accuracyMAPE: 3.1,
    convergenceIterations: 124,
    solutionQuality: 88,
    runtimeMs200: 1890,
    radarScores: {
      accuracy: 87,
      convergenceSpeed: 84,
      solutionQuality: 88,
      scalability: 82,
      robustness: 85,
    },
    trend: [80, 81, 82, 83, 84, 84, 85, 86, 87, 87, 88, 88],
    scalabilityPoints: [
      { fleetSize: 10,  runtimeMs: 68 },
      { fleetSize: 25,  runtimeMs: 155 },
      { fleetSize: 50,  runtimeMs: 320 },
      { fleetSize: 100, runtimeMs: 720 },
      { fleetSize: 200, runtimeMs: 1890 },
      { fleetSize: 300, runtimeMs: 3400 },
      { fleetSize: 500, runtimeMs: 7200 },
    ],
  },

  // ── 3. Genetic Algorithm ───────────────────────────────────────────────────
  {
    rank: 3,
    name: 'Genetic Algorithm',
    method: 'GA',
    accuracyMAPE: 5.8,
    convergenceIterations: 312,
    solutionQuality: 76,
    runtimeMs200: 4200,
    radarScores: {
      accuracy: 72,
      convergenceSpeed: 65,
      solutionQuality: 76,
      scalability: 68,
      robustness: 74,
    },
    trend: [70, 71, 71, 72, 73, 73, 74, 74, 75, 75, 76, 76],
    scalabilityPoints: [
      { fleetSize: 10,  runtimeMs: 180 },
      { fleetSize: 25,  runtimeMs: 420 },
      { fleetSize: 50,  runtimeMs: 900 },
      { fleetSize: 100, runtimeMs: 2100 },
      { fleetSize: 200, runtimeMs: 4200 },
      { fleetSize: 300, runtimeMs: 8800 },
      { fleetSize: 500, runtimeMs: 22000 },
    ],
  },

  // ── 4. Simulated Annealing ─────────────────────────────────────────────────
  {
    rank: 4,
    name: 'Simulated Annealing',
    method: 'Simulated Annealing',
    accuracyMAPE: 7.2,
    convergenceIterations: 489,
    solutionQuality: 68,
    runtimeMs200: 6100,
    radarScores: {
      accuracy: 64,
      convergenceSpeed: 52,
      solutionQuality: 68,
      scalability: 58,
      robustness: 66,
    },
    trend: [63, 63, 64, 64, 65, 65, 66, 66, 67, 67, 68, 68],
    scalabilityPoints: [
      { fleetSize: 10,  runtimeMs: 280 },
      { fleetSize: 25,  runtimeMs: 680 },
      { fleetSize: 50,  runtimeMs: 1500 },
      { fleetSize: 100, runtimeMs: 3200 },
      { fleetSize: 200, runtimeMs: 6100 },
      { fleetSize: 300, runtimeMs: 14000 },
      { fleetSize: 500, runtimeMs: 38000 },
    ],
  },

  // ── 5. Random Search ───────────────────────────────────────────────────────
  {
    rank: 5,
    name: 'Random Search',
    method: 'Random Search',
    accuracyMAPE: 12.4,
    convergenceIterations: 1000,
    solutionQuality: 45,
    runtimeMs200: 9800,
    radarScores: {
      accuracy: 40,
      convergenceSpeed: 28,
      solutionQuality: 45,
      scalability: 35,
      robustness: 42,
    },
    trend: [42, 43, 43, 44, 44, 44, 45, 45, 45, 45, 45, 45],
    scalabilityPoints: [
      { fleetSize: 10,  runtimeMs: 420 },
      { fleetSize: 25,  runtimeMs: 1050 },
      { fleetSize: 50,  runtimeMs: 2400 },
      { fleetSize: 100, runtimeMs: 5200 },
      { fleetSize: 200, runtimeMs: 9800 },
      { fleetSize: 300, runtimeMs: 21000 },
      { fleetSize: 500, runtimeMs: 58000 },
    ],
  },
];
