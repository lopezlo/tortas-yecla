'use client';

import { cn } from '@/lib/utils';

interface RatingControlProps {
  label: string;
  description: string;
  labels: [string, string, string];
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function RatingControl({
  label,
  description,
  labels,
  value,
  onChange,
  error,
}: RatingControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-stone-900 text-base tracking-tight">{label}</p>
          <p className="text-xs text-stone-400 mt-0.5">{description}</p>
        </div>
        <span className={cn(
          'text-xl font-black tabular-nums transition-all duration-150',
          value > 0 ? 'text-stone-950' : 'text-stone-200'
        )}>
          {value > 0 ? value : '—'}
          {value > 0 && <span className="text-xs text-stone-300 font-bold">/5</span>}
        </span>
      </div>

      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          const filled = value >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                'flex-1 h-11 rounded-xl font-black text-sm transition-all duration-150',
                selected
                  ? 'bg-stone-950 text-white scale-105 shadow-lg'
                  : filled
                  ? 'bg-stone-150 text-stone-600 border-2 border-stone-200'
                  : 'bg-stone-50 text-stone-300 border-2 border-stone-100 hover:border-stone-200 hover:text-stone-400'
              )}
              aria-label={`${label}: ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between px-0.5">
        <span className="text-[10px] text-stone-400 font-medium">{labels[0]}</span>
        <span className="text-[10px] text-stone-400 font-medium">{labels[1]}</span>
        <span className="text-[10px] text-stone-400 font-medium">{labels[2]}</span>
      </div>

      <p className={`text-xs font-semibold ${error ? 'text-red-500' : 'invisible'}`}>
        {error || 'x'}
      </p>
    </div>
  );
}
