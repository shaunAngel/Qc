# VERDANT QUANTA

**Quantum-Inspired Fuel Consumption Prediction and Green Fleet Optimization**

A premium, dark-first React web application demonstrating quantum-inspired metaheuristics for maritime fleet fuel management. Built for Clean & Green Technology (PS 26138).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 (custom design system) |
| Animation | Framer Motion 11 |
| Charts | Recharts 2 |
| Routing | React Router DOM 6 |
| Fonts | Space Grotesk · Inter · JetBrains Mono |
| Data | Static TypeScript modules (no backend) |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## Views

### 1. Fleet Dashboard (`/`)
High-level fleet overview. Features: hero section with animated particle-swarm background, 5 KPI cards (vessels, efficiency, CO₂ saved, schedule reliability, cargo demand), 30-day fuel consumption area chart, fleet fuel-mix donut (VLSFO / LNG / methanol / hydrogen / ammonia / shore power), real-time alerts panel, and a responsive 12-vessel grid with sparklines.

### 2. Fuel Predictor (`/predictor`)
Deterministic quantum-inspired prediction engine. Configure vessel type, fuel, speed, load factor, weather, sailing style, and hull fouling. Live speed-vs-consumption what-if curve updates as you drag sliders. Feature-importance bar chart shows which inputs matter most. Model card displays MAPE 2.3%, RMSE 12.4 t, R² 0.967.

### 3. Optimizer Studio (`/optimizer`)
Showpiece multi-objective optimization. Select vessels, tune fuel/cost/GHG objective weights, choose algorithm (Quantum Annealing-inspired / QPSO / GA Baseline), and toggle alternative fuels. Run triggers a 3-phase NodeGraph animation (~3.5 seconds), then reveals: constraint chip status, Pareto frontier scatter, before/after bar chart, and per-vessel fuel recommendations.

### 4. Benchmark Arena (`/benchmark`)
Four-panel comparison of quantum vs conventional methods:
- **Accuracy** — MAPE grouped bar chart
- **Convergence Speed** — 12-month quality trend lines
- **Solution Quality** — 5-axis radar (top 3 methods)
- **Scalability** — runtime vs fleet size 10–500 (log scale)

"Run Benchmark" reveals panels sequentially. Verdict banner: "Quantum-inspired converges 3.2× faster at 200 vessels."

---

## Mock Data

All data lives in `/src/data/` with TypeScript types in `/src/types/index.ts`.

| File | Contents |
|---|---|
| `fleet.ts` | 12 vessels (Tanker, Bulk Carrier, Container, LNG Carrier, Ferry, RORO) across all 5 fuel types |
| `consumption.ts` | 30-day fleet fuel consumption series with actual, target, and forecast |
| `predictions.ts` | Deterministic `predictFuelConsumption()` function + 5 history entries |
| `optimizations.ts` | `runOptimization()` (weighted fuel scoring) + 5 named presets |
| `benchmarks.ts` | 5 method entries with scalability points and 12-month quality trends |
| `alerts.ts` | 15 fleet alerts (5 critical, 5 warning, 5 info) |

---

## Project Structure

```
src/
├── components/
│   ├── animations/     # QuantumOrb, NodeGraph, PageTransition
│   ├── charts/         # AreaChart, BarChart, LineChart, RadarChart, ScatterChart wrappers
│   ├── nav/            # TopNav
│   └── ui/             # GlassCard, Badge, KPICard, Button
├── data/               # All mock data modules
├── lib/                # chartTheme.ts
├── pages/              # Dashboard, Predictor, Optimizer, Benchmark
├── types/              # Shared TypeScript interfaces
├── App.tsx             # Router + shell
├── index.css           # Tailwind + Google Fonts + CSS vars
└── main.tsx
```

---

## Design System

- **Base**: `#050B14` — deep navy
- **Emerald** `#10B981` — efficiency, positive metrics  
- **Cyan** `#06B6D4` — quantum, information
- **Amber** `#F59E0B` — constraints, caution
- **Coral** `#F87171` — emissions, alerts

Glass cards: `backdrop-blur-[12px]`, `bg-white/[0.04]`, `border-white/[0.08]`
