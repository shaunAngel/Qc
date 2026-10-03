import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Settings, Activity, Compass, Anchor, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', label: 'Fleet Dashboard', icon: LayoutDashboard },
  { to: '/predictor', label: 'Fuel Predictor', icon: TrendingUp },
  { to: '/optimizer', label: 'Optimizer Studio', icon: Settings },
  { to: '/benchmark', label: 'Benchmark Arena', icon: Activity },
];

export default function Sidebar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('theme', 'pastel');
    }
  };

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col bg-surface/80 backdrop-blur-[12px] border-r border-border fixed top-0 left-0 z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-border">
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
                  : 'text-text-secondary hover:text-text-primary hover:bg-overlay'
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

      {/* Fleet Info Footer & Theme Toggle */}
      <div className="p-4 border-t border-border">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between gap-3 px-3 py-2.5 mb-3 rounded-xl transition-all duration-300 font-body text-sm text-text-secondary hover:text-text-primary hover:bg-overlay"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 opacity-70" /> : <Sun className="w-5 h-5 opacity-70" />}
            <span>{isDark ? 'Dark Theme' : 'Pastel Theme'}</span>
          </div>
          <div className="w-8 h-4 bg-overlay rounded-full relative border border-border">
            <motion.div
              layout
              className="w-3 h-3 bg-text-primary rounded-full absolute top-[1px]"
              initial={false}
              animate={{ left: isDark ? '1.125rem' : '0.25rem' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
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
