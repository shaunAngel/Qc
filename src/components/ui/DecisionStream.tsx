import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Radio,
  Zap,
} from 'lucide-react';

type Decision = {
  id: number;
  time: string;
  type: 'detected' | 'analyzing' | 'simulation' | 'decision' | 'executed';
  title: string;
  description: string;
  value?: string;
};

const initialDecisions: Decision[] = [
  {
    id: 1,
    time: '14:32:08',
    type: 'detected',
    title: 'ANOMALY DETECTED',
    description: 'Energy deviation detected on VQ-03',
    value: '+27.4%',
  },
  {
    id: 2,
    time: '14:32:09',
    type: 'analyzing',
    title: 'ANALYZING STATE',
    description: 'Evaluating fleet allocation constraints',
    value: '12 states',
  },
  {
    id: 3,
    time: '14:32:10',
    type: 'simulation',
    title: 'SIMULATION COMPLETE',
    description: 'Scenario #07 produced lowest energy cost',
    value: '-14.2%',
  },
  {
    id: 4,
    time: '14:32:11',
    type: 'decision',
    title: 'DECISION SELECTED',
    description: 'Optimal allocation identified',
    value: '0.94 confidence',
  },
  {
    id: 5,
    time: '14:32:12',
    type: 'executed',
    title: 'OPTIMIZATION EXECUTED',
    description: 'Fleet parameters updated successfully',
    value: '184 kWh saved',
  },
];

const iconMap = {
  detected: Radio,
  analyzing: BrainCircuit,
  simulation: Cpu,
  decision: Activity,
  executed: CheckCircle2,
};

const colorMap = {
  detected: 'text-amber',
  analyzing: 'text-cyan',
  simulation: 'text-cyan',
  decision: 'text-emerald',
  executed: 'text-emerald',
};

export function DecisionStream() {
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((current) =>
        current >= initialDecisions.length
          ? 3
          : current + 1,
      );
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#050c16]">

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(16,185,129,.6), rgba(6,182,212,.5), transparent)',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">

        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald" />

            <h3 className="font-display text-sm font-semibold text-text-primary">
              QUANTA INTELLIGENCE
            </h3>
          </div>

          <p className="mt-1 text-[9px] font-mono tracking-[0.12em] text-text-secondary">
            AUTONOMOUS DECISION STREAM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald animate-ping opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>

          <span className="text-[9px] font-mono text-emerald">
            LIVE
          </span>
        </div>
      </div>

      {/* Stream */}
      <div className="p-4">

        <AnimatePresence mode="popLayout">
          {initialDecisions
            .slice(0, visibleCount)
            .map((decision, index) => {
              const Icon = iconMap[decision.type];
              const color = colorMap[decision.type];

              return (
                <motion.div
                  key={decision.id}
                  layout
                  initial={{
                    opacity: 0,
                    x: -15,
                    filter: 'blur(4px)',
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    x: 15,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.08,
                  }}
                  className="relative flex gap-3"
                >

                  {/* Timeline */}
                  <div className="flex flex-col items-center">

                    <div
                      className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] ${color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {index !== visibleCount - 1 && (
                      <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-white/10 to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 flex-1 min-w-0">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <div className="flex items-center gap-2">

                          <span className="text-[10px] font-mono text-text-secondary">
                            {decision.time}
                          </span>

                          <span
                            className={`text-[10px] font-mono font-semibold ${color}`}
                          >
                            {decision.title}
                          </span>

                        </div>

                        <p className="mt-1 text-[11px] text-text-secondary leading-relaxed">
                          {decision.description}
                        </p>
                      </div>

                      {decision.value && (
                        <span
                          className={`shrink-0 rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] font-mono ${color}`}
                        >
                          {decision.value}
                        </span>
                      )}

                    </div>
                  </div>

                </motion.div>
              );
            })}
        </AnimatePresence>

      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">

        <span className="text-[9px] font-mono text-text-secondary">
          MODEL LATENCY
          <span className="text-text-primary ml-2">
            42ms
          </span>
        </span>

        <span className="text-[9px] font-mono text-text-secondary">
          CONFIDENCE
          <span className="text-emerald ml-2">
            94.8%
          </span>
        </span>

      </div>
    </div>
  );
}