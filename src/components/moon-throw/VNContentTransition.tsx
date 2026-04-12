import { motion, AnimatePresence } from 'framer-motion'

interface VNTransitionProps {
  children: React.ReactNode
  phase: 'intro' | 'playing'
}

export function VNContentTransition({ children, phase }: VNTransitionProps) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
