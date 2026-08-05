import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Copy, Trash2 } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { Toast } from '../Common/Toast';
import { UnlockPrompt } from '../Auth/UnlockPrompt';

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
}

export function PasswordHistory({ history, onClear, locked }) {
  const { copied, copy } = useClipboard();

  if (locked) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-on-surface-variant" />
          <h2 className="text-base font-semibold text-on-surface">Recent History</h2>
        </div>
        <UnlockPrompt />
      </section>
    );
  }

  if (!history.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-on-surface-variant" />
          <h2 className="text-base font-semibold text-on-surface">Recent History</h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-outline hover:text-error transition-colors cursor-pointer flex items-center gap-1"
        >
          <Trash2 size={12} />
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {history.map(item => (
            <motion.div
              key={item.id ?? item.createdAt}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-base border border-outline-variant/30 hover:border-outline-variant/60 transition-colors group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="font-mono-display text-sm text-on-surface-variant truncate select-all">
                  {'•'.repeat(Math.min(item.value.length, 20))}
                </div>
                <div>
                  <p className="label-caps text-[9px]">Created</p>
                  <p className="text-xs text-on-surface-variant">{timeAgo(item.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => copy(item.value)}
                aria-label="Copy"
                className="w-9 h-9 flex items-center justify-center rounded text-outline hover:text-primary opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer shrink-0"
              >
                <Copy size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Toast message="Copied from history!" visible={copied} />
    </section>
  );
}
