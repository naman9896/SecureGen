import { Moon, Sun, ShieldCheck } from 'lucide-react';

export function Header({ dark, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-surface-lowest border-b border-outline-variant/40 sticky top-0 z-30">
      {/* Mobile brand */}
      <div className="flex items-center gap-2 lg:hidden">
        <ShieldCheck size={18} className="text-primary-container" />
        <span className="font-bold text-on-surface text-sm tracking-tight">SecureGen</span>
      </div>
      {/* Desktop spacer */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors duration-150 cursor-pointer"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-high border border-outline-variant/50 overflow-hidden flex items-center justify-center">
          <ShieldCheck size={14} className="text-on-surface-variant" />
        </div>
      </div>
    </header>
  );
}
