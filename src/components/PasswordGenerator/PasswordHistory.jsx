import { Clock, Copy, Trash2 } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { Toast } from '../Common/Toast';

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
}

export function PasswordHistory({ history, onClear }) {
  const { copied, copy } = useClipboard();

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
        {history.map((item, i) => (
          <div
            key={i}
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
              className="w-7 h-7 flex items-center justify-center rounded text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
            >
              <Copy size={13} />
            </button>
          </div>
        ))}
      </div>
      <Toast message="Copied from history!" visible={copied} />
    </section>
  );
}
