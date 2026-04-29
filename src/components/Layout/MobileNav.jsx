import { Lock, KeyRound, Settings } from 'lucide-react';

const NAV = [
  { id: 'password', label: 'Passwords', Icon: Lock },
  { id: 'apikey', label: 'API Keys', Icon: KeyRound },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function MobileNav({ active, onNavigate }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-lowest border-t border-outline-variant/40 z-30 flex">
      {NAV.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-wider uppercase transition-colors duration-150 cursor-pointer
            ${active === id ? 'text-primary-container' : 'text-outline hover:text-on-surface-variant'}`}
        >
          <Icon size={18} strokeWidth={active === id ? 2 : 1.5} />
          {label}
        </button>
      ))}
    </nav>
  );
}
