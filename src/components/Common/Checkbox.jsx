import { Check } from 'lucide-react';

export function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors duration-150 border focus:outline-none
          ${checked
            ? 'bg-primary-container border-primary-container'
            : 'bg-transparent border-outline hover:border-primary'}`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>
      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{label}</span>
    </label>
  );
}
