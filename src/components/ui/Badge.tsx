type BadgeVariant = 'emerald' | 'cyan' | 'amber' | 'coral' | 'red' | 'gray';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald/20 text-emerald border border-emerald/30',
  cyan: 'bg-cyan/20 text-cyan border border-cyan/30',
  amber: 'bg-amber/20 text-amber border border-amber/30',
  coral: 'bg-coral/20 text-coral border border-coral/30',
  red: 'bg-red-500/20 text-red-400 border border-red-500/30',
  gray: 'bg-white/10 text-text-secondary border border-white/20',
};

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-body ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
