import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from 'recharts';
import { CHART_THEME, CHART_COLORS } from '@/lib/chartTheme';

interface BarDef {
  key: string;
  color?: string;
  name?: string;
}

interface BarChartWrapperProps {
  data: Record<string, unknown>[];
  bars: BarDef[];
  xDataKey: string;
  layout?: 'horizontal' | 'vertical';
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

export function BarChartWrapper({
  data,
  bars,
  xDataKey,
  layout = 'horizontal',
  height = 240,
  className = '',
}: BarChartWrapperProps) {
  const isVertical = layout === 'vertical';

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={isVertical ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, left: isVertical ? 8 : -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.gridColor}
            vertical={!isVertical}
            horizontal={isVertical}
          />
          {isVertical ? (
            <>
              <XAxis type="number" tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey={xDataKey}
                tick={CHART_THEME.axis.tick}
                axisLine={CHART_THEME.axis.line}
                tickLine={false}
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xDataKey}
                tick={CHART_THEME.axis.tick}
                axisLine={CHART_THEME.axis.line}
                tickLine={false}
              />
              <YAxis tick={CHART_THEME.axis.tick} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {bars.length > 1 && (
            <Legend
              wrapperStyle={{ color: CHART_THEME.textColor, fontSize: 11 }}
            />
          )}
          {bars.map((bar, i) => {
            const color = bar.color ?? themeColors[i % themeColors.length];
            return (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name ?? bar.key}
                fill={color}
                radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={48}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
