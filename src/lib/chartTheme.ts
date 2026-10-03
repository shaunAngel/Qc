export const CHART_COLORS = {
  emerald: 'var(--color-emerald)',
  cyan: 'var(--color-cyan)',
  amber: 'var(--color-amber)',
  coral: 'var(--color-coral)',
  emeraldLight: 'var(--color-emerald-light)',
  cyanLight: 'var(--color-cyan-light)',
  amberLight: 'var(--color-amber-light)',
  coralLight: 'var(--color-coral-light)',
};

export const CHART_THEME = {
  backgroundColor: 'transparent',
  gridColor: 'var(--color-border)',
  textColor: 'var(--color-text-secondary)',
  colors: [CHART_COLORS.emerald, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.coral],
  tooltip: {
    contentStyle: {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      color: 'var(--color-text-primary)',
    },
  },
  axis: {
    tick: { fill: 'var(--color-text-secondary)', fontSize: 11 },
    line: { stroke: 'var(--color-border)' },
  },
};
