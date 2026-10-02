# VERDANT QUANTA — Requirements

## Overview
VERDANT QUANTA is a frontend-only, quantum-inspired fuel consumption prediction and green fleet optimization web application. It is built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts. All data is mock and lives in `/src/data`. There is no backend.

---

## 1. Project Setup

### 1.1 Scaffold
- **Given** a new workspace, **when** the project is initialized, **then** a Vite + React + TypeScript project must exist at the workspace root.

### 1.2 Dependencies
- **Given** the project scaffold, **when** dependencies are installed, **then** the following packages must be present:
  - `tailwindcss`, `postcss`, `autoprefixer`
  - `framer-motion`
  - `recharts`
  - `@fontsource/space-grotesk`, `@fontsource/inter`, `@fontsource/jetbrains-mono` (or equivalent Google Fonts import)
  - `react-router-dom` for client-side routing

### 1.3 Fonts
- **Given** the app loads, **when** any text is rendered, **then** the following font families must be available:
  - **Space Grotesk** — headings and brand text
  - **Inter** — body text and UI labels
  - **JetBrains Mono** — numeric readouts, code-style data

---

## 2. Design System

### 2.1 Color Palette
- **Given** the design system, **when** the app renders, **then** it must use a dark-first palette with the following tokens:
  - `bg-base`: `#050B14`
  - `bg-surface`: `#0A1628`
  - `bg-card`: `rgba(255,255,255,0.04)` (glass)
  - Accent **emerald**: `#10B981` / `#34D399`
  - Accent **cyan**: `#06B6D4` / `#22D3EE`
  - Accent **amber**: `#F59E0B` / `#FCD34D`
  - Accent **coral**: `#F97316` / `#FB923C`
  - Text primary: `#F1F5F9`
  - Text secondary: `#94A3B8`

### 2.2 Glass Cards
- **Given** any card component, **when** rendered, **then** it must use a backdrop blur, semi-transparent background, and a subtle border (`rgba(255,255,255,0.08)`).

### 2.3 Responsive Layout
- **Given** the app, **when** rendered on desktop (≥1024px), **then** multi-column layouts must be used.
- **Given** the app, **when** rendered on mobile (<768px), **then** single-column stacked layouts must be used.

---

## 3. Navigation

### 3.1 Top Navigation Bar
- **Given** the app, **when** any page is active, **then** a persistent top navigation bar must show the VERDANT QUANTA brand logo/wordmark and links to all four views.

### 3.2 Active Route Indication
- **Given** the nav bar, **when** a route is active, **then** the corresponding nav link must be visually highlighted.

### 3.3 Animated Route Transitions
- **Given** navigation between views, **when** the route changes, **then** Framer Motion page transitions must animate the entering and exiting views.

---

## 4. View 1 — Landing / Fleet Dashboard

### 4.1 Hero Section
- **Given** the landing view, **when** rendered, **then** a hero section must display the product name, tagline, and a primary CTA button that navigates to the Fuel Predictor.

### 4.2 KPI Strip
- **Given** the fleet dashboard, **when** rendered, **then** a row of at least 4 animated KPI cards must display: total fleet vehicles, average fuel efficiency (MPG or L/100km), total CO₂ saved (tonnes), and fleet health score.

### 4.3 Fleet Map / Grid
- **Given** the fleet dashboard, **when** rendered, **then** a grid of vehicle cards must show each vehicle's ID, type, status (active/idle/maintenance), current fuel level, and a mini sparkline trend.

### 4.4 Fleet Summary Chart
- **Given** the fleet dashboard, **when** rendered, **then** a Recharts area or line chart must display fleet-wide fuel consumption over the last 30 days.

### 4.5 Live Alerts Panel
- **Given** the fleet dashboard, **when** rendered, **then** a scrollable alerts panel must list mock real-time alerts (e.g., low fuel warning, maintenance due, anomaly detected) with severity badges.

---

## 5. View 2 — Fuel Predictor

### 5.1 Input Form
- **Given** the Fuel Predictor view, **when** rendered, **then** a form must allow the user to configure a prediction run with inputs: vehicle type, route distance (km), load weight (kg), weather condition, and driving style.

### 5.2 Quantum-Inspired Animation
- **Given** the form is submitted, **when** the prediction is "computing", **then** a Framer Motion animation (e.g., pulsing quantum orb or particle wave) must display while the result is being "calculated" (mock 2-second delay).

### 5.3 Prediction Results
- **Given** the prediction completes, **when** results are displayed, **then** the following must appear: predicted fuel consumption (L or gallons), confidence interval, CO₂ output estimate, efficiency score, and a recommended fuel-saving tip.

### 5.4 Comparison Chart
- **Given** prediction results, **when** displayed, **then** a Recharts bar chart must compare the predicted consumption against fleet average and optimal benchmark.

### 5.5 History Log
- **Given** the Fuel Predictor, **when** at least one prediction has been run, **then** a history table must list past predictions in the current session with key metrics.

---

## 6. View 3 — Optimizer Studio

### 6.1 Fleet Selection
- **Given** the Optimizer Studio, **when** rendered, **then** the user must be able to select a subset of vehicles from the mock fleet to include in the optimization run.

### 6.2 Optimization Parameters
- **Given** the fleet selection, **when** the user configures a run, **then** sliders/toggles must allow adjusting: optimization target (minimize cost / minimize emissions / maximize range), time horizon (days), and priority constraints (delivery deadlines, load limits).

### 6.3 Quantum Optimization Animation
- **Given** the run is triggered, **when** "optimizing", **then** a Framer Motion animated visualization (e.g., node-graph convergence or waveform collapse) must indicate processing.

### 6.4 Optimization Results
- **Given** the optimization completes, **when** results are shown, **then** the output must include: estimated savings (%), CO₂ reduction, recommended route/schedule adjustments, and a before/after Recharts comparison chart.

### 6.5 Export / Apply Simulation
- **Given** optimization results, **when** the user clicks "Apply Plan", **then** a mock success modal or toast notification must confirm the plan was "applied to fleet".

---

## 7. View 4 — Benchmark Arena

### 7.1 Leaderboard
- **Given** the Benchmark Arena, **when** rendered, **then** a ranked leaderboard must display mock fleet entities (companies or vehicle classes) sorted by green efficiency score.

### 7.2 Benchmark Charts
- **Given** the Benchmark Arena, **when** rendered, **then** a Recharts radar/spider chart must compare multiple fleet metrics (fuel efficiency, emissions, cost per km, uptime, maintenance score) across selected entities.

### 7.3 Time-Series Trend
- **Given** the Benchmark Arena, **when** rendered, **then** a multi-line Recharts chart must show how top-ranked fleets' efficiency scores changed over 12 months.

### 7.4 Achievement Badges
- **Given** the Benchmark Arena, **when** rendered, **then** a badge/trophy system must display earned sustainability achievements (e.g., "Carbon Neutral Month", "Peak Efficiency", "Zero Idle").

### 7.5 Filter & Sort
- **Given** the leaderboard, **when** the user changes filter/sort controls, **then** the rankings and charts must update reactively from mock data.

---

## 8. Mock Data

### 8.1 Data Location
- **Given** the project structure, **when** data is needed, **then** all mock data must reside in `/src/data/` as TypeScript files with explicit types.

### 8.2 Data Coverage
- **Given** the mock data module, **when** imported, **then** it must provide: fleet vehicle list, historical fuel consumption series, prediction results, optimization outputs, benchmark leaderboard entries, and alert events.

---

## 9. Performance & Code Quality

### 9.1 TypeScript
- **Given** any source file, **when** written, **then** it must use strict TypeScript with no implicit `any`.

### 9.2 Component Structure
- **Given** the codebase, **when** organized, **then** components must be co-located under `/src/components/` with sub-folders per feature/view.

### 9.3 No Backend
- **Given** the app, **when** running, **then** no HTTP requests to external APIs must be made; all data originates from `/src/data/`.
