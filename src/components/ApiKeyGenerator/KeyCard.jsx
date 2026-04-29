import { useState } from 'react';
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
            className="w-7 h-7 flex items-center justify-center rounded text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <QrCode size={13} />
          </button>
          <button
            onClick={() => copy(item.value)}
            aria-label="Copy"
            className="w-7 h-7 flex items-center justify-center rounded text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <Copy size={13} />
          </button>
        </div>
      </div>
      {qr && <QRModal value={item.value} onClose={() => setQr(false)} />}
      <Toast message="API key copied!" visible={copied} />
    </>
  );
}
