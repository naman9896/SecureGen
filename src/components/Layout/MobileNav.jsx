import { motion } from 'framer-motion';
import { Lock, KeyRound, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { id: 'password', label: 'Passwords', Icon: Lock },
  { id: 'apikey', label: 'API Keys', Icon: KeyRound },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function MobileNav({ active, onNavigate }) {
  const { user } = useAuth();
  const nav = [...NAV, { id: 'account', label: user ? 'Account' : 'Sign In', Icon: User }];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface-lowest border-t border-outline-variant/40 z-30 flex">
      {nav.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold tracking-wider uppercase transition-colors duration-150 cursor-pointer
            ${active === id ? 'text-primary-container' : 'text-outline hover:text-on-surface-variant'}`}
        >
          {active === id && (
            <motion.div
              layoutId="mobilenav-indicator"
              className="absolute top-1 w-10 h-10 rounded-full bg-primary-container/15"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex flex-col items-center gap-1">
            <Icon size={18} strokeWidth={active === id ? 2 : 1.5} />
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
