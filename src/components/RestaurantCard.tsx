'use client';

import { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { DAYS_SHORT, RATING_PARAMS } from '@/lib/utils';
import type { RankingRow } from '@/lib/actions';

const MEDAL: Record<number, { emoji: string; accent: string }> = {
  1: { emoji: '🥇', accent: 'bg-amber-500' },
  2: { emoji: '🥈', accent: 'bg-stone-400' },
  3: { emoji: '🥉', accent: 'bg-orange-400' },
};

interface RestaurantCardProps {
  restaurant: RankingRow;
  rank: number;
}

export default function RestaurantCard({ restaurant: r, rank }: RestaurantCardProps) {
  const [expanded, setExpanded] = useState(false);
  const medal = MEDAL[rank];
  const scoreOut10 = r.totalScore !== null ? r.totalScore * 2 : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`;

  const detailScores = [
    { label: RATING_PARAMS[0].label, value: r.avgSize },
    { label: RATING_PARAMS[1].label, value: r.avgFlavor },
    { label: RATING_PARAMS[2].label, value: r.avgDough },
    { label: RATING_PARAMS[3].label, value: r.avgFilling },
    { label: RATING_PARAMS[4].label, value: r.avgOil },
  ];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm shadow-stone-900/5">
      <button
        className="w-full text-left px-5 py-5"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-4">
          {/* Rank badge */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            {medal ? (
              <span className="text-2xl leading-none">{medal.emoji}</span>
            ) : (
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
                <span className="text-sm font-black text-stone-400">{rank}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-black text-stone-950 text-base tracking-tight truncate">{r.name}</p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-stone-400 flex items-center gap-1 mt-0.5 hover:text-amber-600 transition-colors"
            >
              <MapPin size={10} />
              <span className="truncate">{r.address}</span>
            </a>

            {r.daysOpen && r.daysOpen.length > 0 && (
              <div className="flex gap-1 mt-2.5">
                {Object.entries(DAYS_SHORT).map(([day, short]) => (
                  <span
                    key={day}
                    className={[
                      'w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center',
                      r.daysOpen!.includes(day)
                        ? 'bg-stone-950 text-white'
                        : 'bg-stone-100 text-stone-300',
                    ].join(' ')}
                  >
                    {short}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Score */}
          <div className="shrink-0 text-right">
            {scoreOut10 !== null ? (
              <div className="bg-stone-950 rounded-2xl px-3 py-2 text-center min-w-[3.5rem]">
                <p className="text-xl font-black text-white leading-none">{scoreOut10.toFixed(1)}</p>
                <p className="text-[9px] text-stone-500 font-bold mt-0.5">{r.evalCount} eval.</p>
              </div>
            ) : (
              <div className="bg-stone-100 rounded-2xl px-3 py-2 text-center">
                <p className="text-xs font-bold text-stone-400">Sin datos</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <div className={[
            'w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center transition-transform duration-200',
            expanded ? 'rotate-180' : '',
          ].join(' ')}>
            <ChevronDown size={14} className="text-stone-400" />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-stone-50 px-5 py-4 bg-stone-50/80">
          {r.evalCount === 0 ? (
            <p className="text-sm text-stone-400 text-center py-2">
              Todavía no hay evaluaciones
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
                Promedio por parámetro
              </p>
              {detailScores.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-500 w-16 shrink-0">{s.label}</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-950 rounded-full transition-all"
                      style={{ width: s.value ? `${(s.value / 5) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs font-black text-stone-950 w-14 text-right">
                    {s.value ? `${(s.value * 2).toFixed(1)}/10` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
