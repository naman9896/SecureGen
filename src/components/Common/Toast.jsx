import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg
            bg-surface-high/90 backdrop-blur-xl border border-outline-variant/50
            text-on-surface text-sm font-medium shadow-2xl"
        >
          <CheckCircle size={15} className="text-secondary shrink-0" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
