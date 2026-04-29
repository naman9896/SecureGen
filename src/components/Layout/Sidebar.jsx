import { KeyRound, Lock, Settings, ShieldCheck } from 'lucide-react';

const NAV = [
  { id: 'password', label: 'Password Generator', Icon: Lock },
  { id: 'apikey', label: 'API Key Generator', Icon: KeyRound },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function Sidebar({ active, onNavigate }) {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-surface-lowest border-r border-outline-variant/40 min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-outline-variant/30">
        <div className="flex items-center gap-2.5 mb-1">
          <ShieldCheck size={20} className="text-primary-container" />
          <span className="text-base font-bold text-on-surface tracking-tight">SecureGen</span>
        </div>
        <p className="text-[11px] label-caps pl-0.5">Institutional Vault</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer
              ${active === id
                ? 'bg-primary-container/15 text-primary border-l-2 border-primary-container'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high'}`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-base border border-outline-variant/40">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={14} className="text-primary-container" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-on-surface truncate">Security Logo</p>
            <p className="text-[10px] label-caps">Vault v4.2</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
