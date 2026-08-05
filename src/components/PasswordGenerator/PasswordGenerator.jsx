import { Cpu, BarChart2 } from 'lucide-react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { PasswordDisplay } from './PasswordDisplay';
import { StrengthMeter } from './StrengthMeter';
import { PasswordHistory } from './PasswordHistory';
import { Checkbox } from '../Common/Checkbox';

export function PasswordGenerator() {
  const { password, opts, strength, generate, updateOpt, history, clearHistory, locked } = usePasswordGenerator();

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Password Generator</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Create cryptographically strong passwords with customizable entropy levels.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-surface-base rounded-xl border border-outline-variant/40 p-5 space-y-5">
        <PasswordDisplay password={password} onRegenerate={() => generate()} />

        {/* Strength + Entropy row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <StrengthMeter score={strength.score} label={strength.label} bits={strength.bits} />
          </div>
          <div className="flex items-center gap-3 bg-surface-high rounded-lg px-4 py-3 border border-outline-variant/30">
            <BarChart2 size={18} className="text-tertiary shrink-0" />
            <div className="flex-1">
              <p className="label-caps text-[10px]">Entropy Level</p>
            </div>
            <span className="text-lg font-bold text-tertiary font-mono-display">{strength.bits} bits</span>
          </div>
        </div>

        <div className="h-px bg-outline-variant/30" />

        {/* Length slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-on-surface">Password Length</span>
            <span className="text-lg font-bold text-primary font-mono-display">{opts.length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={opts.length}
            onChange={e => updateOpt('length', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-1.5">
            <span className="label-caps text-[10px]">8 chars</span>
            <span className="label-caps text-[10px]">128 chars</span>
          </div>
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Checkbox checked={opts.uppercase} onChange={v => updateOpt('uppercase', v)} label="Uppercase" />
          <Checkbox checked={opts.lowercase} onChange={v => updateOpt('lowercase', v)} label="Lowercase" />
          <Checkbox checked={opts.numbers} onChange={v => updateOpt('numbers', v)} label="Numbers" />
          <Checkbox checked={opts.symbols} onChange={v => updateOpt('symbols', v)} label="Symbols" />
          <div className="col-span-2">
            <Checkbox
              checked={opts.avoidAmbiguous}
              onChange={v => updateOpt('avoidAmbiguous', v)}
              label="Avoid Ambiguous (0, O, l, 1)"
            />
          </div>
        </div>
      </div>

      {/* Secure banner */}
      <div
        className="relative rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-base"
        style={{ minHeight: 100 }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 60% 50%, #4edea3 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 p-5 flex items-end h-full" style={{ minHeight: 100 }}>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Cpu size={11} className="text-secondary" />
              <span className="label-caps text-[9px] text-secondary">Secure Architecture</span>
            </div>
            <p className="text-sm font-medium text-on-surface">AES-256 Client-Side Generation Enabled</p>
          </div>
        </div>
      </div>

      {/* History */}
      <PasswordHistory history={history} onClear={clearHistory} locked={locked} />
    </div>
  );
}
