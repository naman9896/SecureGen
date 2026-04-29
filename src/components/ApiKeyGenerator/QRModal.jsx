import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QRModal({ value, onClose }) {
  if (!value) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-base border border-outline-variant/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-on-surface">QR Code</h3>
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="flex justify-center p-4 bg-white rounded-xl">
          <QRCodeSVG value={value} size={200} />
        </div>
        <p className="mt-3 text-[10px] text-outline text-center font-mono-display break-all">{value}</p>
      </div>
    </div>
  );
}
