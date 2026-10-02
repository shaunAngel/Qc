import type { Alert } from '@/types';

// 15 alerts referencing vessel IDs from fleet.ts
// Distribution: 5 critical, 5 warning, 5 info
export const alerts: Alert[] = [
  // ── Critical (5) ──────────────────────────────────────────────────────────
  {
    id: 'ALT-001',
    vesselId: 'VES-010',
    severity: 'critical',
    message: 'LNG Helios Stream: Fuel level critically low at 20 %. Immediate bunkering required before next departure.',
    timestamp: '2025-01-15T03:12:00Z',
  },
  {
    id: 'ALT-002',
    vesselId: 'VES-003',
    severity: 'critical',
    message: 'MT Cobalt Meridian: Main engine anomaly detected — abnormal vibration signature on cylinder bank 2. Vessel placed in maintenance hold.',
    timestamp: '2025-01-14T18:45:00Z',
  },
  {
    id: 'ALT-003',
    vesselId: 'VES-001',
    severity: 'critical',
    message: 'MV Quantum Tide: CII emission cap violation projected for current voyage. Reduce speed to ≤ 13 knots immediately.',
    timestamp: '2025-01-15T07:30:00Z',
  },
  {
    id: 'ALT-004',
    vesselId: 'VES-004',
    severity: 'critical',
    message: 'MV Nordic Vanguard: Fuel consumption 34 % above threshold. Suspected hull fouling — schedule underwater inspection.',
    timestamp: '2025-01-15T05:55:00Z',
  },
  {
    id: 'ALT-005',
    vesselId: 'VES-009',
    severity: 'critical',
    message: 'LNG Cryos Pioneer: Cargo gas pressure deviation beyond safe limit. Reduce speed and contact port authority.',
    timestamp: '2025-01-14T22:10:00Z',
  },

  // ── Warning (5) ───────────────────────────────────────────────────────────
  {
    id: 'ALT-006',
    vesselId: 'VES-002',
    severity: 'warning',
    message: 'SS Emerald Horizon: Scheduled maintenance due in 14 days (180-day service interval). Book dry-dock slot.',
    timestamp: '2025-01-15T08:00:00Z',
  },
  {
    id: 'ALT-007',
    vesselId: 'VES-006',
    severity: 'warning',
    message: 'CS Aurora Nexus: Speed deviation — current 18.4 kn exceeds optimal eco-speed of 17.0 kn by 8.2 %. Adjust propulsion.',
    timestamp: '2025-01-15T09:15:00Z',
  },
  {
    id: 'ALT-008',
    vesselId: 'VES-005',
    severity: 'warning',
    message: 'MV Solaris Drift: Methanol fuel level at 55 %. Next bunkering port is 1 800 nm away — top up at intermediate stop.',
    timestamp: '2025-01-15T06:40:00Z',
  },
  {
    id: 'ALT-009',
    vesselId: 'VES-012',
    severity: 'warning',
    message: 'RO Steelwind Express: Cargo ramp hydraulic pressure below nominal. Inspect and service before next loading operation.',
    timestamp: '2025-01-15T04:20:00Z',
  },
  {
    id: 'ALT-010',
    vesselId: 'VES-007',
    severity: 'warning',
    message: 'CS Verdant Atlas: Hydrogen tank insulation temperature variance detected. Monitor closely — inspection recommended at next port.',
    timestamp: '2025-01-14T21:00:00Z',
  },

  // ── Info (5) ──────────────────────────────────────────────────────────────
  {
    id: 'ALT-011',
    vesselId: 'VES-008',
    severity: 'info',
    message: 'CS Pacific Prism: Shore power connection established at Rotterdam terminal. Zero-emission port stay active.',
    timestamp: '2025-01-15T10:00:00Z',
  },
  {
    id: 'ALT-012',
    vesselId: 'VES-006',
    severity: 'info',
    message: 'CS Aurora Nexus: Quantum Annealing optimisation complete. Estimated 16.2 % fuel saving on Singapore–Rotterdam leg.',
    timestamp: '2025-01-15T09:45:00Z',
  },
  {
    id: 'ALT-013',
    vesselId: 'VES-011',
    severity: 'info',
    message: 'MV Crystal Fjord: Route updated via meteorological recommendation. Avoiding low-pressure system — ETA unchanged.',
    timestamp: '2025-01-15T07:05:00Z',
  },
  {
    id: 'ALT-014',
    vesselId: 'VES-003',
    severity: 'info',
    message: 'MT Cobalt Meridian: Shore power connected during maintenance stay. Grid electricity supplied — ammonia bunkering paused.',
    timestamp: '2025-01-14T16:30:00Z',
  },
  {
    id: 'ALT-015',
    vesselId: 'VES-010',
    severity: 'info',
    message: 'LNG Helios Stream: Maintenance window updated — estimated return to service in 5 days. Shore power connected.',
    timestamp: '2025-01-14T12:00:00Z',
  },
];
