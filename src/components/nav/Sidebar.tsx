import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Activity, Compass, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', label: 'Fleet Dashboard', icon: LayoutDashboard },
  { to: '/predictor', label: 'Fuel Predictor', icon: TrendingUp },
  { to: '/optimizer', label: 'Optimizer Studio', icon: Settings },
  { to: '/benchmark', label: 'Benchmark Arena', icon: Activity },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen hidden md:flex flex-col bg-surface/80 backdrop-blur-[12px] border-r border-white/[0.08] fixed top-0 left-0 z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-white/[0.08]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Anchor className="w-5 h-5 text-base" />
        </div>
        <span className="font-display font-bold text-lg tracking-wide text-text-primary select-none">
          QUANTUM
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-body text-sm ${
                isActive
                  ? 'text-emerald bg-emerald/10 font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald' : 'opacity-70'}`} />
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-emerald rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Fleet Info Footer */}
      <div className="p-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center relative">
             <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-cyan animate-pulse border-2 border-surface" />
             <Compass className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <p className="text-xs text-text-secondary font-body">Fleet ID</p>
            <p className="text-sm font-mono text-text-primary">VQ-01 Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
