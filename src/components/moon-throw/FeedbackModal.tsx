import { AnimatePresence, motion } from 'framer-motion'

interface FeedbackModalProps {
  show: boolean
  title: string
  message: string
  icon: string
  onClose: () => void
  isGameOver?: boolean
}

export function FeedbackModal({
  show,
  title,
  message,
  icon,
  onClose,
  isGameOver = false,
}: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-sm w-full p-6 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="text-4xl block mb-3">{icon}</span>
            <h2 className="text-lg font-bold text-slate-100 mb-2">{title}</h2>
            <p className="text-sm text-slate-300 whitespace-pre-line mb-4">{message}</p>
            <button
              onClick={onClose}
              className="glass-button px-6 py-2 text-sm"
            >
              {isGameOver ? '重新开始' : '继续'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
