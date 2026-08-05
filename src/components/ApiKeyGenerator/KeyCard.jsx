import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Copy, QrCode } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';
import { Toast } from '../Common/Toast';
import { QRModal } from './QRModal';

function truncate(str) {
  if (str.length <= 28) return str;
  return `${str.slice(0, 12)}...${str.slice(-10)}`;
}

export function KeyCard({ item }) {
  const { copied, copy } = useClipboard();
  const [qr, setQr] = useState(false);
  const label = item.prefix ? 'Live Key' : item.format.toUpperCase();

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface-base border border-outline-variant/30 hover:border-outline-variant/60 transition-colors group">
        <div className="overflow-hidden">
          <p className="label-caps text-[9px] mb-0.5">{label}</p>
          <p className="font-mono-display text-sm text-on-surface truncate select-all">{truncate(item.value)}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          <button
            onClick={() => setQr(true)}
            aria-label="Show QR"
            className="w-9 h-9 flex items-center justify-center rounded text-outline hover:text-primary opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer"
          >
            <QrCode size={14} />
          </button>
          <button
            onClick={() => copy(item.value)}
            aria-label="Copy"
            className="w-9 h-9 flex items-center justify-center rounded text-outline hover:text-primary opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all cursor-pointer"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {qr && <QRModal key="qr" value={item.value} onClose={() => setQr(false)} />}
      </AnimatePresence>
      <Toast message="API key copied!" visible={copied} />
    </>
  );
}
