import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function Toast({ message, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg
        bg-surface-high/90 backdrop-blur-xl border border-outline-variant/50
        text-on-surface text-sm font-medium shadow-2xl
        ${visible ? 'animate-slide-up' : 'opacity-0 transition-opacity duration-200'}`}
    >
      <CheckCircle size={15} className="text-secondary shrink-0" />
      {message}
    </div>
  );
}
