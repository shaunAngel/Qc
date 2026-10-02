export const CHART_COLORS = {
  emerald: '#10B981',
  cyan: '#06B6D4',
  amber: '#F59E0B',
  coral: '#F87171',
  emeraldLight: '#34D399',
  cyanLight: '#22D3EE',
  amberLight: '#FCD34D',
  coralLight: '#FCA5A5',
};

export const CHART_THEME = {
  backgroundColor: 'transparent',
  gridColor: 'rgba(255,255,255,0.06)',
  textColor: '#94A3B8',
  colors: [CHART_COLORS.emerald, CHART_COLORS.cyan, CHART_COLORS.amber, CHART_COLORS.coral],
  tooltip: {
    contentStyle: {
      backgroundColor: '#0A1628',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      color: '#F1F5F9',
    },
  },
  axis: {
    tick: { fill: '#94A3B8', fontSize: 11 },
    line: { stroke: 'rgba(255,255,255,0.06)' },
  },
};
