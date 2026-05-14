'use client';

import { X } from 'lucide-react';
import type { ChangelogEntry } from '@/lib/schema';

interface ChangelogModalProps {
  changelog: ChangelogEntry[];
  onClose: () => void;
}

export default function ChangelogModal({ changelog, onClose }: ChangelogModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-backdrop-enter"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl flex flex-col animate-sheet-enter"
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="font-black text-stone-950 text-xl tracking-tight">Versiones</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-safe">
          <div className="space-y-5 pb-8">
            {changelog.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-8">Sin entradas aún</p>
            ) : (
              changelog.map((entry) => (
                <div key={entry.id} className="bg-stone-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-stone-950 text-white text-xs font-black px-2.5 py-1 rounded-full tracking-wide">
                      v{entry.version}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">{entry.releaseDate}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {(entry.changes ?? []).map((change, i) => (
                      <li key={i} className="text-sm text-stone-600 flex gap-2">
                        <span className="text-amber-500 font-black shrink-0">·</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
