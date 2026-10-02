import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

interface DataKey {
  key: string;
  color?: string;
  name?: string;
}

interface AreaChartWrapperProps {
  data: Record<string, unknown>[];
  dataKeys: DataKey[];
  xDataKey: string;
  height?: number;
  className?: string;
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

export function AreaChartWrapper({
  data,
  dataKeys,
  xDataKey,
  height = 240,
  className = '',
}: AreaChartWrapperProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {dataKeys.map((dk, i) => {
              const color = dk.color ?? themeColors[i % themeColors.length];
              return (
                <linearGradient key={dk.key} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
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
            tick={CHART_THEME.axis.tick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {dataKeys.map((dk, i) => {
            const color = dk.color ?? themeColors[i % themeColors.length];
            return (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name ?? dk.key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${dk.key})`}
                fillOpacity={0.15}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
