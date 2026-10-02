# VERDANT QUANTA — Design Document

## Architecture Overview

VERDANT QUANTA is a single-page application (SPA) with client-side routing via `react-router-dom`. All state is local (React `useState`/`useReducer`). No server communication occurs. Mock data is imported directly from `/src/data/`.

```
verdant-quanta/
├── public/
├── src/
│   ├── assets/            # SVGs, icons
│   ├── components/
│   │   ├── ui/            # Shared primitives (GlassCard, Badge, KPICard, etc.)
│   │   ├── nav/           # TopNav, NavLink
│   │   ├── charts/        # Recharts wrappers (AreaChart, BarChart, RadarChart, LineChart)
│   │   ├── animations/    # Framer Motion reusable animations (QuantumOrb, NodeGraph, PageTransition)
│   │   ├── dashboard/     # Fleet Dashboard components
│   │   ├── predictor/     # Fuel Predictor components
│   │   ├── optimizer/     # Optimizer Studio components
│   │   └── benchmark/     # Benchmark Arena components
│   ├── data/
│   │   ├── fleet.ts
│   │   ├── consumption.ts
│   │   ├── predictions.ts
│   │   ├── optimizations.ts
│   │   ├── benchmarks.ts
│   │   └── alerts.ts
│   ├── hooks/             # Custom React hooks
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Predictor.tsx
│   │   ├── Optimizer.tsx
│   │   └── Benchmark.tsx
│   ├── styles/
│   │   └── globals.css    # Tailwind directives + CSS vars
│   ├── types/
│   │   └── index.ts       # All shared TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## Design System

### Color Tokens (Tailwind Extended)
```ts
// tailwind.config.ts extend.colors
{
  base:    '#050B14',
  surface: '#0A1628',
  card:    'rgba(255,255,255,0.04)',
  emerald: { DEFAULT: '#10B981', light: '#34D399' },
  cyan:    { DEFAULT: '#06B6D4', light: '#22D3EE' },
  amber:   { DEFAULT: '#F59E0B', light: '#FCD34D' },
  coral:   { DEFAULT: '#F97316', light: '#FB923C' },
  text:    { primary: '#F1F5F9', secondary: '#94A3B8' },
}
```

### Typography Scale
| Role | Font | Weight | Size |
|------|------|--------|------|
| Brand/Hero | Space Grotesk | 700 | 3–5rem |
| Page Title | Space Grotesk | 600 | 1.75–2.25rem |
| Section Header | Space Grotesk | 600 | 1.25rem |
| Body | Inter | 400 | 0.875–1rem |
| Label/Caption | Inter | 500 | 0.75rem |
| Numeric readout | JetBrains Mono | 500–700 | context-dependent |

### Glass Card Spec
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(12px);
border-radius: 1rem;
```

---

## Component Designs

### `GlassCard`
A `div` wrapper applying the glass card spec. Accepts `className` for overrides. Used everywhere as the base container.

### `KPICard`
Displays a metric: icon, label, value (JetBrains Mono), delta badge. Animates in with Framer Motion spring on mount.

### `Badge`
Small pill with color variant: `emerald` | `cyan` | `amber` | `coral` | `red`.

### `TopNav`
Fixed top bar with `bg-surface/80 backdrop-blur`. Left: brand wordmark. Right: nav links. Mobile: hamburger menu.

### `PageTransition`
Framer Motion `AnimatePresence` + `motion.div` with `initial={{ opacity:0, y:16 }}` → `animate={{ opacity:1, y:0 }}` → `exit={{ opacity:0, y:-16 }}`.

### `QuantumOrb`
Animated SVG/canvas element: concentric rings that pulse and rotate with `animate={{ rotate: 360, scale: [1, 1.1, 1] }}` on loop. Used as loading indicator in Predictor and Optimizer.

### `NodeGraph`
SVG node-edge diagram where nodes animate their positions toward a "converged" state using Framer Motion layout animations. Used in Optimizer Studio.

---

## Page Designs

### Dashboard (`/`)
```
┌─────────────────────────────────────────────┐
│ TopNav                                       │
├─────────────────────────────────────────────┤
│ HERO: Wordmark + tagline + CTA               │
├─────────────────────────────────────────────┤
│ KPI Strip: [Vehicles] [Avg MPG] [CO₂ Saved] [Health] │
├──────────────────────────┬──────────────────┤
│ Fleet Consumption Chart  │  Live Alerts     │
│ (AreaChart, 30-day)      │  (scrollable)    │
├──────────────────────────┴──────────────────┤
│ Vehicle Grid (responsive cards)             │
└─────────────────────────────────────────────┘
```

**Data:** `fleet.ts` (vehicles), `consumption.ts` (30-day series), `alerts.ts`

**Animations:** KPI cards stagger in; hero text fades up; alerts slide in from right.

---

### Fuel Predictor (`/predictor`)
```
┌─────────────────────────────────────────────┐
│ TopNav                                       │
├──────────────────┬──────────────────────────┤
│ Input Form       │  Results Panel           │
│ - Vehicle Type   │  - Predicted consumption │
│ - Distance       │  - Confidence interval   │
│ - Load Weight    │  - CO₂ estimate          │
│ - Weather        │  - Efficiency score      │
│ - Driving Style  │  - Fuel-saving tip       │
│ [Run Prediction] │                          │
├──────────────────┴──────────────────────────┤
│ Quantum Orb Animation (during computation)  │
├─────────────────────────────────────────────┤
│ Comparison BarChart                         │
├─────────────────────────────────────────────┤
│ History Table                               │
└─────────────────────────────────────────────┘
```

**State:** `inputState`, `isLoading`, `result`, `history[]` — all local `useState`.

**Prediction Logic:** deterministic formula from mock parameters + small random variance. 2-second simulated delay via `setTimeout`.

---

### Optimizer Studio (`/optimizer`)
```
┌─────────────────────────────────────────────┐
│ TopNav                                       │
├──────────────────┬──────────────────────────┤
│ Vehicle Selector │  Parameter Panel         │
│ (checkbox grid)  │  - Optimization Target   │
│                  │  - Time Horizon (slider) │
│                  │  - Priority Constraints  │
│                  │  [Run Optimization]      │
├──────────────────┴──────────────────────────┤
│ Node Graph Animation (during optimization)  │
├──────────────────┬──────────────────────────┤
│ Results Summary  │  Before/After BarChart   │
│ (savings, CO₂)   │                          │
└──────────────────┴──────────────────────────┘
```

**State:** `selectedVehicles[]`, `params`, `isOptimizing`, `results` — all local.

**"Apply Plan" action:** sets a `planApplied` boolean, shows a `motion.div` toast.

---

### Benchmark Arena (`/benchmark`)
```
┌─────────────────────────────────────────────┐
│ TopNav                                       │
├──────────────────┬──────────────────────────┤
│ Filter/Sort Bar  │                          │
├──────────────────┤  Radar Chart             │
│ Leaderboard      │  (multi-fleet comparison)│
│ (ranked list)    ├──────────────────────────┤
│                  │  12-Month Trend Chart    │
│                  │  (multi-line)            │
├──────────────────┴──────────────────────────┤
│ Achievement Badges                          │
└─────────────────────────────────────────────┘
```

**Filter:** controlled dropdown for metric + sort direction. Filters `benchmarks.ts` data reactively.

---

## Data Models (`/src/types/index.ts`)

```ts
export interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car' | 'bus';
  status: 'active' | 'idle' | 'maintenance';
  fuelLevel: number;       // 0-100 %
  fuelEfficiency: number;  // MPG
  mileage: number;
  sparkline: number[];     // last 7 data points
}

export interface ConsumptionPoint {
  date: string;            // ISO date
  consumption: number;     // litres
  target: number;
}

export interface PredictionInput {
  vehicleType: Vehicle['type'];
  distance: number;        // km
  loadWeight: number;      // kg
  weather: 'clear' | 'rain' | 'snow' | 'wind';
  drivingStyle: 'eco' | 'normal' | 'aggressive';
}

export interface PredictionResult extends PredictionInput {
  id: string;
  timestamp: string;
  predictedConsumption: number;
  confidenceLow: number;
  confidenceHigh: number;
  co2Output: number;
  efficiencyScore: number;
  tip: string;
}

export interface OptimizationResult {
  id: string;
  vehicleIds: string[];
  target: 'cost' | 'emissions' | 'range';
  timeHorizon: number;
  savingsPercent: number;
  co2Reduction: number;
  recommendations: string[];
  before: { cost: number; emissions: number; range: number };
  after:  { cost: number; emissions: number; range: number };
}

export interface BenchmarkEntry {
  rank: number;
  name: string;
  fleetSize: number;
  efficiencyScore: number;
  fuelEfficiency: number;
  emissionsScore: number;
  costPerKm: number;
  uptime: number;
  maintenanceScore: number;
  trend: number[];         // 12-month scores
  badges: string[];
}

export interface Alert {
  id: string;
  vehicleId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}
```

---

## Routing

```tsx
// App.tsx
<Routes>
  <Route path="/"           element={<Dashboard />} />
  <Route path="/predictor"  element={<Predictor />} />
  <Route path="/optimizer"  element={<Optimizer />} />
  <Route path="/benchmark"  element={<Benchmark />} />
</Routes>
```

`AnimatePresence` wraps the `<Routes>` block with `mode="wait"`.

---

## Recharts Configuration

All charts use a shared theme config:
```ts
export const CHART_THEME = {
  backgroundColor: 'transparent',
  gridColor: 'rgba(255,255,255,0.06)',
  textColor: '#94A3B8',
  colors: ['#10B981', '#06B6D4', '#F59E0B', '#F97316'],
};
```

Custom `<Tooltip>` and `<Legend>` components styled to match glass card aesthetic.

---

## Correctness Properties

1. **Navigation completeness** — every route defined in the router must have a corresponding nav link, and every nav link must resolve to a valid route.
2. **Data consistency** — vehicle IDs referenced in alerts and optimization results must exist in the fleet data.
3. **Prediction determinism** — given identical `PredictionInput`, the mock prediction function must return results within the same confidence band on every invocation.
4. **No external requests** — the build must contain zero `fetch`/`axios`/`XMLHttpRequest` calls in production code.
5. **Type safety** — the TypeScript compiler must report zero errors with `strict: true`.
