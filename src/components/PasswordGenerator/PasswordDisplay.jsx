import { useState } from 'react';
import { RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { Toast } from '../Common/Toast';

export function PasswordDisplay({ password, onRegenerate }) {
  const { copied, copy } = useClipboard();
  const [hidden, setHidden] = useState(false);
  const [shake, setShake] = useState(false);

  const handleRegenerate = () => {
    onRegenerate();
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };

  const display = hidden ? '•'.repeat(password.length) : password;

  return (
    <>
      <div className="relative flex items-center bg-surface-lowest rounded-lg border border-outline-variant/50 overflow-hidden group">
        <div className="flex-1 px-5 py-4 overflow-x-auto">
          <p
            className={`font-mono-display text-xl text-primary whitespace-nowrap select-all ${shake ? 'animate-shake' : ''}`}
          >
            {display}
          </p>
        </div>

        <div className="flex items-center gap-1 pr-3 shrink-0">
          <button
            onClick={() => setHidden(h => !h)}
            aria-label={hidden ? 'Show password' : 'Hide password'}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
          >
            {hidden ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            onClick={handleRegenerate}
            aria-label="Regenerate"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => copy(password)}
            aria-label="Copy password"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-container/20 border border-primary-container/30 text-primary hover:bg-primary-container/30 transition-colors cursor-pointer"
          >
            <Copy size={15} />
          </button>
        </div>
      </div>
      <Toast message="Password copied!" visible={copied} />
    </>
  );
}
