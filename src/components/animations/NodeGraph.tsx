import { motion, AnimatePresence } from 'framer-motion';

type NodeGraphPhase = 'idle' | 'scanning' | 'converging' | 'resolving' | 'done';

interface NodeGraphProps {
  phase: NodeGraphPhase;
  vesselCount?: number;
  className?: string;
}

const WIDTH = 300;
const HEIGHT = 220;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 80;

// Pre-compute node positions arranged in a circle
const NODE_COUNT = 7;
const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
  const angle = (i / NODE_COUNT) * 2 * Math.PI - Math.PI / 2;
  return {
    id: i,
    x: CX + RADIUS * Math.cos(angle),
    y: CY + RADIUS * Math.sin(angle),
  };
});

export function NodeGraph({ phase, className = '' }: NodeGraphProps) {
  const isDone = phase === 'done';
  const isConverging = phase === 'converging' || phase === 'resolving' || isDone;
  const isScanning = phase === 'scanning';
  const isResolving = phase === 'resolving' || isDone;

  return (
    <div className={className} style={{ width: WIDTH, height: HEIGHT }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <defs>
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines — animate toward center when converging */}
        {nodes.map((node) => (
          <motion.line
            key={`line-${node.id}`}
            x1={node.x}
            y1={node.y}
            x2={CX}
            y2={CY}
            stroke="#06B6D4"
            strokeWidth="1"
            strokeOpacity={isConverging ? 0.5 : 0}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isConverging ? 1 : 0,
              opacity: isConverging ? 0.5 : 0,
            }}
            transition={{
              duration: 0.6,
              delay: node.id * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Scanning sweep line */}
        <AnimatePresence>
          {isScanning && (
            <motion.line
              key="scan-line"
              x1={0}
              y1={CY}
              x2={WIDTH}
              y2={CY}
              stroke="#F59E0B"
              strokeWidth="1"
              strokeOpacity="0.6"
              initial={{ y: -HEIGHT }}
              animate={{ y: [0, HEIGHT, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={6}
            fill="rgba(6,182,212,0.2)"
            stroke="#06B6D4"
            strokeWidth="1.5"
            animate={{
              fill: isScanning
                ? ['rgba(6,182,212,0.2)', 'rgba(245,158,11,0.4)', 'rgba(6,182,212,0.2)']
                : isConverging
                ? 'rgba(6,182,212,0.4)'
                : 'rgba(6,182,212,0.2)',
              scale: isConverging ? [1, 0.6, 0.8] : 1,
              opacity: isDone ? 0.4 : 1,
            }}
            transition={{
              fill: isScanning
                ? { duration: 0.8, delay: node.id * 0.2, repeat: Infinity }
                : { duration: 0.4 },
              scale: isConverging
                ? { duration: 0.8, delay: node.id * 0.1 }
                : { duration: 0.3 },
              opacity: { duration: 0.4 },
            }}
            style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
          />
        ))}

        {/* Center radial glow when resolving */}
        <AnimatePresence>
          {isResolving && (
            <motion.circle
              key="center-glow"
              cx={CX}
              cy={CY}
              r={40}
              fill="url(#center-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 0.8, 0.4] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ originX: `${CX}px`, originY: `${CY}px` }}
            />
          )}
        </AnimatePresence>

        {/* Center node */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={10}
          fill="rgba(16,185,129,0.3)"
          stroke="#10B981"
          strokeWidth="2"
          animate={{
            scale: isResolving ? [1, 1.4, 1] : 1,
            fill: isDone
              ? 'rgba(16,185,129,0.8)'
              : isConverging
              ? 'rgba(16,185,129,0.5)'
              : 'rgba(16,185,129,0.3)',
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
        />

        {/* Checkmark in done state */}
        <AnimatePresence>
          {isDone && (
            <motion.path
              key="checkmark"
              d={`M ${CX - 5} ${CY} L ${CX - 1} ${CY + 4} L ${CX + 6} ${CY - 4}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
