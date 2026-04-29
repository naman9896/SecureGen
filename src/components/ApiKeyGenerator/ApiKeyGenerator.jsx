import { useState } from 'react';
import { RefreshCw, Copy, Download, ShieldCheck, Zap, Lock, SlidersHorizontal } from 'lucide-react';
import { useApiKeyGenerator } from '../../hooks/useApiKeyGenerator';
import { useClipboard } from '../../hooks/useClipboard';
import { Toast } from '../Common/Toast';
import { KeyCard } from './KeyCard';

const FORMATS = ['alphanumeric', 'hex', 'base64'];
const FORMAT_LABELS = { alphanumeric: 'ALNUM', hex: 'HEX', base64: 'BASE64' };

const KEY_LENGTHS = [16, 24, 32, 48, 64];

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ApiKeyGenerator() {
  const { keys, opts, generate, updateOpt } = useApiKeyGenerator();
  const { copied: copiedAll, copy: copyAll } = useClipboard();
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    generate();
    setGenerated(true);
  };

  const recentKeys = keys.slice(0, opts.count);

  const handleCopyAll = () => {
    copyAll(recentKeys.map(k => k.value).join('\n'));
  };

  const handleDownloadTxt = () => {
    downloadFile(keys.map(k => k.value).join('\n'), 'api-keys.txt', 'text/plain');
  };

  const handleDownloadCsv = () => {
    const rows = [
      'key,format,created_at',
      ...keys.map(k => `${k.value},${k.format},${new Date(k.createdAt).toISOString()}`),
    ];
    downloadFile(rows.join('\n'), 'api-keys.csv', 'text/csv');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="label-caps text-[10px] text-secondary">Encryption Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">API Key Generator</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-medium text-secondary">System Status: Encrypted</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left — Generator Logic */}
        <div className="bg-surface-base rounded-xl border border-outline-variant/40 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-on-surface-variant" />
            <h2 className="text-sm font-semibold text-on-surface">Generator Logic</h2>
          </div>

          {/* Format selector */}
          <div>
            <p className="label-caps text-[10px] mb-2">Format Selector</p>
            <div className="flex gap-2">
              {FORMATS.map(f => (
                <button
                  key={f}
                  onClick={() => updateOpt('format', f)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors duration-150 cursor-pointer
                    ${opts.format === f
                      ? 'border-primary-container bg-primary-container/20 text-primary'
                      : 'border-outline-variant/50 text-on-surface-variant hover:border-outline hover:text-on-surface'}`}
                >
                  {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Prefix */}
          <div>
            <p className="label-caps text-[10px] mb-2">Prefix String</p>
            <div className="relative">
              <input
                type="text"
                value={opts.prefix}
                onChange={e => updateOpt('prefix', e.target.value)}
                placeholder="e.g., sk-prod-"
                maxLength={20}
                className="w-full bg-surface-high border border-outline-variant/50 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition-colors font-mono-display"
              />
            </div>
          </div>

          {/* Length + Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="label-caps text-[10px] mb-2">Key Length</p>
              <select
                value={opts.length}
                onChange={e => updateOpt('length', Number(e.target.value))}
                className="w-full bg-surface-high border border-outline-variant/50 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary-container cursor-pointer"
              >
                {KEY_LENGTHS.map(l => (
                  <option key={l} value={l}>{l} Bytes</option>
                ))}
              </select>
            </div>
            <div>
              <p className="label-caps text-[10px] mb-2">Batch Quantity</p>
              <input
                type="number"
                min={1}
                max={100}
                value={opts.count}
                onChange={e => updateOpt('count', Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-full bg-surface-high border border-outline-variant/50 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary-container text-center font-mono-display"
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-primary-container text-white font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <RefreshCw size={15} />
            Generate Infrastructure Keys
          </button>

          {/* Encryption info */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-secondary/5 border border-secondary/15">
            <ShieldCheck size={16} className="text-secondary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-on-surface mb-0.5">Encryption Standard</p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Keys are generated using cryptographically secure pseudo-random number generators (CSPRNG)
                and are never logged server-side.
              </p>
            </div>
          </div>
        </div>

        {/* Right — Generated output */}
        <div className="bg-surface-base rounded-xl border border-outline-variant/40 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <h2 className="text-sm font-semibold text-on-surface">Generated Output</h2>
            </div>
            {keys.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  aria-label="Copy all"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary-container transition-colors cursor-pointer"
                >
                  <Copy size={13} />
                </button>
                <div className="relative group">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:border-primary-container transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                  </button>
                  <div className="absolute right-0 top-9 hidden group-hover:flex flex-col z-20 bg-surface-high border border-outline-variant/50 rounded-lg overflow-hidden shadow-xl min-w-[120px]">
                    <button onClick={handleDownloadTxt} className="px-4 py-2 text-xs text-on-surface-variant hover:bg-surface-highest hover:text-on-surface text-left cursor-pointer transition-colors">
                      Download TXT
                    </button>
                    <button onClick={handleDownloadCsv} className="px-4 py-2 text-xs text-on-surface-variant hover:bg-surface-highest hover:text-on-surface text-left cursor-pointer transition-colors">
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key list */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {keys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Lock size={28} className="text-outline mb-3" />
                <p className="text-sm text-on-surface-variant">No keys generated yet</p>
                <p className="text-xs text-outline mt-1">Configure settings and click generate</p>
              </div>
            ) : (
              keys.slice(0, 10).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i < 3 && (
                    <span className="label-caps text-[9px] px-1.5 py-0.5 rounded bg-secondary/15 text-secondary shrink-0">
                      Active
                    </span>
                  )}
                  <KeyCard item={item} />
                </div>
              ))
            )}
          </div>

          {keys.length > 10 && (
            <div className="text-center">
              <p className="text-xs text-on-surface-variant">
                Additional {keys.length - 10} keys generated and ready for export.
              </p>
              <p className="text-[10px] text-outline mt-0.5">
                Total Entropy: {opts.length * 8} bits per key
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
            <span className="label-caps text-[9px]">Vault Snapshot V2.4</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<RefreshCw size={16} className="text-primary" />}
          label="Active Keys"
          value={keys.length.toString()}
          sub="+12% from last epoch"
        />
        <StatCard
          icon={<Zap size={16} className="text-secondary" />}
          label="Auth Requests"
          value="8.4M"
          sub="99.9% Success Rate"
          valueClass="text-secondary"
        />
        <StatCard
          icon={<ShieldCheck size={16} className="text-tertiary" />}
          label="Avg. Entropy"
          value={`${opts.length * 8} bits`}
          sub="Maximum Security Level"
          valueClass="text-tertiary"
        />
      </div>

      <Toast message="All keys copied!" visible={copiedAll} />
    </div>
  );
}

function StatCard({ icon, label, value, sub, valueClass = 'text-on-surface' }) {
  return (
    <div className="bg-surface-base rounded-xl border border-outline-variant/40 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="label-caps text-[10px]">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold font-mono-display ${valueClass}`}>{value}</p>
      <p className="text-[11px] text-outline mt-1">{sub}</p>
    </div>
  );
}
