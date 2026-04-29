import { STRENGTH_COLORS, STRENGTH_TEXT_COLORS } from '../../utils/strength';

export function StrengthMeter({ score, label, bits }) {
  const segments = [1, 2, 3, 4];
  const color = STRENGTH_COLORS[score] || '#414755';
  const textColor = STRENGTH_TEXT_COLORS[score] || 'text-outline';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="label-caps">Security Strength</span>
        <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1.5 mb-1">
        {segments.map(s => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: s <= score ? color : '#272a32' }}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <span className="text-[10px] text-outline">{bits} bits entropy</span>
      </div>
    </div>
  );
}
