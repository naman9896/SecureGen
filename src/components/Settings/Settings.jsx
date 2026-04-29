import { ShieldCheck, Info } from 'lucide-react';
import { Toggle } from '../Common/Toggle';

export function Settings({ dark, onToggleTheme }) {
  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1">Configure your SecureGen preferences.</p>
      </div>

      <div className="space-y-3">
        <SettingRow
          label="Dark Mode"
          description="Toggle between dark and light interface theme"
        >
          <Toggle checked={dark} onChange={onToggleTheme} />
        </SettingRow>
      </div>

      <div className="bg-surface-base rounded-xl border border-outline-variant/40 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-on-surface-variant" />
          <h2 className="text-sm font-semibold text-on-surface">Security Notice</h2>
        </div>
        <div className="space-y-2 text-[13px] text-on-surface-variant leading-relaxed">
          <p>All password and API key generation happens entirely in your browser using the Web Crypto API (CSPRNG).</p>
          <p>No data is ever sent to a server, stored, or logged. Your generated credentials remain private.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/5 border border-secondary/15">
        <ShieldCheck size={16} className="text-secondary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          <span className="font-semibold text-on-surface">SecureGen v1.0.0</span> — Fortress Protocol Design System
        </p>
      </div>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-surface-base rounded-xl border border-outline-variant/40">
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
