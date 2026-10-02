# VERDANT QUANTA — Implementation Tasks

## Task List

- [x] 1. Project Scaffold & Tooling — Initialize the Vite + React + TypeScript workspace, install core dependencies (react-router-dom, framer-motion, recharts), configure Tailwind CSS v3 with PostCSS and Autoprefixer, add Google Fonts (Space Grotesk, Inter, JetBrains Mono), set tsconfig strict mode with `@/` path aliases, mirror aliases in Vite config, and strip out all Vite boilerplate.

- [x] 2. Design System & Global Styles — Extend `tailwind.config.ts` with custom color tokens (base, surface, card, emerald, cyan, amber, coral, text-primary, text-secondary) and font families (space-grotesk, inter, jetbrains-mono); write `src/styles/globals.css` with Tailwind directives and CSS custom properties; create `src/lib/chartTheme.ts` exporting a shared `CHART_THEME` constant for all Recharts components.

- [x] 3. Shared UI Primitives — Build the full component library: `GlassCard`, `Badge` (emerald/cyan/amber/coral/red variants), `KPICard` (icon + label + JetBrains Mono value + delta badge + spring-in animation), `Button` (primary/secondary/ghost), `PageTransition` (Framer Motion opacity+y), `QuantumOrb` (pulsing/rotating SVG rings), `NodeGraph` (SVG convergence animation), `AreaChartWrapper`, `BarChartWrapper`, `RadarChartWrapper`, `LineChartWrapper`, and a `ScatterChartWrapper` (Recharts ScatterChart with custom tooltip and theme).

- [x] 4. Navigation & Routing Shell — Build the fixed `TopNav` with brand wordmark, nav links to all four views, backdrop blur, active-route highlight, and a collapsible hamburger menu for viewports narrower than 768 px; wire up `src/App.tsx` with `BrowserRouter`, `AnimatePresence`, four `<Route>` entries pointing to page stubs, and a catch-all 404 route that redirects to Dashboard.

- [x] 5. Mock Data Layer — Create `src/types/index.ts` defining all shared TypeScript interfaces: `Vessel` (including a `fuelType` field typed to a `FuelType` enum of VLSFO | LNG | methanol | hydrogen | ammonia, plus a `shorePowerUsage` boolean field), `ConsumptionPoint`, `PredictionInput`, `PredictionResult`, `OptimizationResult`, `BenchmarkEntry`, and `Alert`; populate `src/data/fleet.ts` with 12 `Vessel` objects spanning all five fuel types with varied shore-power usage flags; add `src/data/consumption.ts` (30-day series), `src/data/predictions.ts` (deterministic `predictFuelConsumption` + 5 history entries), `src/data/optimizations.ts` (`runOptimization` + `getOptimizationPresets`), `src/data/benchmarks.ts` (8 `BenchmarkEntry` objects with 12-month trends), and `src/data/alerts.ts` (15 `Alert` objects referencing vessel IDs).

- [x] 6. Dashboard Page — Assemble `src/pages/Dashboard.tsx` with: a full-width hero (Space Grotesk heading, tagline, CTA linking to `/predictor`, Framer Motion fade-up); a KPI strip of five `KPICard` components (total vessels, average fleet efficiency, total CO₂ saved, schedule reliability %, cargo demand met %); a side-by-side chart row containing the 30-day fleet consumption `AreaChart` and a fleet fuel-mix donut chart (`PieChart`) showing VLSFO / LNG / methanol / hydrogen / ammonia / shore-power proportions; an alerts panel (scrollable glass card with severity badges); and a responsive vessel grid (3 cols desktop / 2 tablet / 1 mobile) of vessel cards each showing vessel ID, type icon, status badge, fuel type badge, fuel level bar, efficiency, and mini sparkline.

- [x] 7. Fuel Predictor Page — Assemble `src/pages/Predictor.tsx` with: a `PredictorForm` (vessel-type select, distance, load weight, weather, sailing style); a `PredictionResults` card (predicted consumption, confidence interval, CO₂ output, efficiency ring, fuel-saving tip, Framer Motion slide-in); a three-bar comparison chart (predicted vs fleet average vs optimal); a speed-vs-consumption what-if `LineChart` that recalculates and redraws live as the vessel-speed slider moves; a horizontal feature-importance `BarChart` showing which inputs (speed, load, weather, vessel type, route) most influence the prediction result; a small model card displaying MAPE, RMSE, and R² metrics; and a prediction history table (timestamp, vessel type, distance, predicted consumption, efficiency score) — show the `QuantumOrb` loading animation for 2 seconds on form submit before revealing results.

- [x] 8. Optimizer Studio Page — Assemble `src/pages/Optimizer.tsx` with: a vessel checkbox selector grid; objective weight sliders for fuel weight, cost weight, and lifecycle GHG weight; constraint chips that display feasible/violated states for cargo demand, schedule reliability, and emission cap; an algorithm selector offering Quantum Annealing-inspired, QPSO, and GA baseline options; alternative fuel toggles per fuel type and a shore-power toggle; on optimization run, show the `NodeGraph` convergence animation for ~3–4 seconds before revealing results; display a results summary card (savings %, CO₂ reduction, recommendations) alongside a before/after grouped `BarChart`; render a Pareto frontier `ScatterChart` whose points represent fleet configurations and whose hover tooltip shows configuration details (vessel count, fuel mix, cost, emissions); and include an "Apply Plan" action that triggers an `ApplyPlanToast` confirmation.

- [x] 9. Benchmark Arena Page — Assemble `src/pages/Benchmark.tsx` with four benchmark panels that compare quantum-inspired vs conventional methods: an Accuracy panel (grouped `BarChart`), a Convergence Speed panel (overlaid multi-line `LineChart`), a Solution Quality panel (`RadarChart` across 5 metrics), and a Scalability panel (`LineChart` of runtime vs fleet size from 10 to 500 vessels with a logarithmic x-axis); add a "Run benchmark" button that triggers sequential animated reveal of each panel's results; display a verdict banner summarising the headline finding (e.g., "Quantum-inspired converges 3.2× faster at 200 vessels"); keep a sort control for the underlying data; ensure no achievement badges appear anywhere on this page.

- [x] 10. Polish & Animations — Add Framer Motion stagger entrance animations (using `variants` with `staggerChildren`) to every list and grid render across all four views; add hover glow effects (scale 1.02, border glow) to all interactive cards; and verify the responsive layout at 375 px, 768 px, 1024 px, and 1440 px widths.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3", "4"] },
    { "id": 3, "tasks": ["5"] },
    { "id": 4, "tasks": ["6", "7", "8", "9"] },
    { "id": 5, "tasks": ["10"] }
  ]
}
```
