import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

interface LineDef {
  key: string;
  color?: string;
  name?: string;
  strokeDasharray?: string;
}

interface LineChartWrapperProps {
  data: Record<string, unknown>[];
  lines: LineDef[];
  xDataKey: string;
  height?: number;
  className?: string;
  yAxisScale?: 'linear' | 'log';
}

const themeColors = [
  CHART_COLORS.emerald,
  CHART_COLORS.cyan,
  CHART_COLORS.amber,
  CHART_COLORS.coral,
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_THEME.tooltip.contentStyle}>
      <p className="text-xs font-medium text-text-secondary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name ?? entry.dataKey}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function LineChartWrapper({
  data,
  lines,
  xDataKey,
  height = 240,
  className = '',
  yAxisScale = 'linear',
}: LineChartWrapperProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.gridColor}
            vertical={false}
          />
          <XAxis
            dataKey={xDataKey}
            tick={CHART_THEME.axis.tick}
            axisLine={CHART_THEME.axis.line}
            tickLine={false}
          />
          <YAxis
            scale={yAxisScale}
            domain={yAxisScale === 'log' ? ['auto', 'auto'] : undefined}
            tick={CHART_THEME.axis.tick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {lines.length > 1 && (
            <Legend wrapperStyle={{ color: CHART_THEME.textColor, fontSize: 11 }} />
          )}
          {lines.map((line, i) => {
            const color = line.color ?? themeColors[i % themeColors.length];
            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name ?? line.key}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={line.strokeDasharray}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
