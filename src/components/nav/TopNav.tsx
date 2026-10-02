import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  to: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',           label: 'Fleet Dashboard' },
  { to: '/predictor',  label: 'Fuel Predictor'  },
  { to: '/optimizer',  label: 'Optimizer Studio' },
  { to: '/benchmark',  label: 'Benchmark Arena'  },
]

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface/80 backdrop-blur-[12px] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-6">

          {/* ── Brand wordmark ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Emerald brand glyph */}
            <span className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-display font-bold text-lg tracking-wide text-text-primary select-none">
              VERDANT QUANTA
            </span>
          </div>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to} className="relative">
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 text-sm font-body transition-colors duration-200 rounded-lg ${
                      isActive
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Right: Fleet ID button + hamburger ── */}
          <div className="flex items-center gap-3">
            {/* Fleet ID badge — desktop */}
            <button className="hidden md:inline-flex items-center gap-1.5 border border-cyan/50 text-cyan rounded-xl px-3 py-1.5 text-sm hover:bg-cyan/10 transition-colors font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              Fleet ID: VQ-01
            </button>

            {/* Hamburger — mobile */}
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-text-primary rounded-full origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-text-primary rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-text-primary rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-surface border-b border-white/[0.08] md:hidden"
          >
            <ul className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-body transition-colors duration-200 ${
                        isActive
                          ? 'bg-white/[0.08] text-text-primary border border-white/[0.08]'
                          : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              {/* Fleet ID in mobile menu */}
              <li className="mt-2 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center gap-1.5 border border-cyan/50 text-cyan rounded-xl px-3 py-1.5 text-sm w-fit font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                  Fleet ID: VQ-01
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
