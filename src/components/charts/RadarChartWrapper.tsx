import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

interface RadarKey {
  key: string;
  color?: string;
  name?: string;
}

interface RadarChartWrapperProps {
  data: { subject: string; [key: string]: number | string }[];
  keys: RadarKey[];
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

export function RadarChartWrapper({
  data,
  keys,
  height = 300,
  className = '',
}: RadarChartWrapperProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke={CHART_THEME.gridColor} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: CHART_THEME.textColor, fontSize: 11 }}
          />
          <PolarRadiusAxis
            tick={false}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          {keys.length > 1 && (
            <Legend wrapperStyle={{ color: CHART_THEME.textColor, fontSize: 11 }} />
          )}
          {keys.map((rk, i) => {
            const color = rk.color ?? themeColors[i % themeColors.length];
            return (
              <Radar
                key={rk.key}
                name={rk.name ?? rk.key}
                dataKey={rk.key}
                stroke={color}
                fill={color}
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            );
          })}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
