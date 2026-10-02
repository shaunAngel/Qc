import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import TopNav from '@/components/nav/TopNav'
import PageTransition from '@/components/animations/PageTransition'
import Dashboard from '@/pages/Dashboard'
import Predictor from '@/pages/Predictor'
import Optimizer from '@/pages/Optimizer'
import Benchmark from '@/pages/Benchmark'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/predictor" element={<PageTransition><Predictor /></PageTransition>} />
        <Route path="/optimizer" element={<PageTransition><Optimizer /></PageTransition>} />
        <Route path="/benchmark" element={<PageTransition><Benchmark /></PageTransition>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base text-text-primary">
        <TopNav />
        <main className="pt-16">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}
