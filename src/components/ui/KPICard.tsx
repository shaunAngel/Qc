import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

type KPIAccent = 'emerald' | 'cyan' | 'amber' | 'coral';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: React.ReactNode;
  accent: KPIAccent;
}

const accentTextClass: Record<KPIAccent, string> = {
  emerald: 'text-emerald',
  cyan: 'text-cyan',
  amber: 'text-amber',
  coral: 'text-coral',
};

const accentBgClass: Record<KPIAccent, string> = {
  emerald: 'bg-emerald/10',
  cyan: 'bg-cyan/10',
  amber: 'bg-amber/10',
  coral: 'bg-coral/10',
};

export function KPICard({
  label,
  value,
  unit,
  delta,
  deltaPositive,
  icon,
  accent,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassCard className="p-5 h-full" accent={accent} animate>
        <div className="flex items-start justify-between gap-3">
          {icon && (
            <div
              className={`p-2 rounded-xl ${accentBgClass[accent]} ${accentTextClass[accent]} shrink-0`}
            >
              {icon}
            </div>
          )}
          {delta !== undefined && (
            <span
              className={`ml-auto text-xs font-medium font-body px-2 py-0.5 rounded-full border ${
                deltaPositive
                  ? 'bg-emerald/20 text-emerald border-emerald/30'
                  : 'bg-coral/20 text-coral border-coral/30'
              }`}
            >
              {deltaPositive ? '▲' : '▼'} {delta}
            </span>
          )}
        </div>

        <div className="mt-3">
          <p className="text-xs font-medium font-body text-text-secondary uppercase tracking-wider">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-2xl font-bold font-mono ${accentTextClass[accent]}`}
            >
              {value}
            </span>
            {unit && (
              <span className="text-sm font-body text-text-secondary">{unit}</span>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
