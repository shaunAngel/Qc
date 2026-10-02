import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

interface ScatterChartWrapperProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  nameKey?: string;
  colorKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customTooltip?: React.ComponentType<any>;
  height?: number;
  className?: string;
}

const colorPalette = [
  CHART_COLORS.emerald,
  CHART_COLORS.cyan,
  CHART_COLORS.amber,
  CHART_COLORS.coral,
];

function DefaultTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as Record<string, unknown> | undefined;
  if (!point) return null;

  return (
    <div style={CHART_THEME.tooltip.contentStyle} className="p-3 min-w-[140px]">
      {Object.entries(point).map(([k, v]) => (
        <p key={k} className="text-xs font-mono text-text-secondary">
          <span className="text-text-primary">{k}:</span> {String(v)}
        </p>
      ))}
    </div>
  );
}

export function ScatterChartWrapper({
  data,
  xKey,
  yKey,
  colorKey,
  customTooltip: TooltipComponent,
  height = 300,
  className = '',
}: ScatterChartWrapperProps) {
  // If colorKey is provided, group data by color values so each group gets a distinct color
  const hasColorGroups = Boolean(colorKey);

  let colorGroups: { color: string; points: Record<string, unknown>[] }[] = [];

  if (hasColorGroups && colorKey) {
    const groupMap = new Map<string, Record<string, unknown>[]>();
    for (const point of data) {
      const key = String(point[colorKey] ?? 'default');
      const existing = groupMap.get(key);
      if (existing) {
        existing.push(point);
      } else {
        groupMap.set(key, [point]);
      }
    }
    colorGroups = Array.from(groupMap.entries()).map(([, points], i) => ({
      color: colorPalette[i % colorPalette.length],
      points,
    }));
  }

  const TooltipEl = TooltipComponent ?? DefaultTooltip;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
          <XAxis
            dataKey={xKey}
            type="number"
            name={xKey}
            tick={CHART_THEME.axis.tick}
            axisLine={CHART_THEME.axis.line}
            tickLine={false}
          />
          <YAxis
            dataKey={yKey}
            type="number"
            name={yKey}
            tick={CHART_THEME.axis.tick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<TooltipEl />} cursor={{ strokeDasharray: '3 3', stroke: CHART_THEME.gridColor }} />
          {hasColorGroups
            ? colorGroups.map((group, i) => (
                <Scatter
                  key={i}
                  data={group.points}
                  fill={group.color}
                  fillOpacity={0.8}
                  r={5}
                />
              ))
            : (
                <Scatter
                  data={data}
                  fill={CHART_COLORS.cyan}
                  fillOpacity={0.8}
                  r={5}
                />
              )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
