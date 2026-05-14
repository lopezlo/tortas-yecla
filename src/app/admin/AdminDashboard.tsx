'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LogOut,
  Plus,
  Pencil,
  ChevronDown,
  Loader2,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react';
import AdminRestaurantForm from '@/components/AdminRestaurantForm';
import {
  adminCreateChangelog,
  adminUpdateSuggestionStatus,
} from '@/lib/actions';
import type { Restaurant, Suggestion, ChangelogEntry } from '@/lib/schema';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  suggestions: Suggestion[];
  changelog: ChangelogEntry[];
}

type Tab = 'restaurants' | 'suggestions' | 'changelog';

export default function AdminDashboard({
  restaurants,
  suggestions,
  changelog,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('restaurants');
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null | 'new'>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Changelog form state
  const [clVersion, setClVersion] = useState('');
  const [clDate, setClDate] = useState(new Date().toISOString().split('T')[0]);
  const [clChanges, setClChanges] = useState('');
  const [clSaved, setClSaved] = useState(false);

  function handleSaved() {
    setEditingRestaurant(null);
    router.refresh();
  }

  function handleSuggestionStatus(id: string, status: string) {
    startTransition(async () => {
      await adminUpdateSuggestionStatus(id, status);
      router.refresh();
    });
  }

  function handleChangelogSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clVersion.trim() || !clChanges.trim()) return;
    startTransition(async () => {
      await adminCreateChangelog({
        version: clVersion.trim(),
        releaseDate: clDate,
        changes: clChanges
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
      });
      setClVersion('');
      setClChanges('');
      setClSaved(true);
      setTimeout(() => setClSaved(false), 3000);
      router.refresh();
    });
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'restaurants', label: 'Locales', count: restaurants.length },
    {
      key: 'suggestions',
      label: 'Sugerencias',
      count: suggestions.filter((s) => s.status === 'pending').length,
    },
    { key: 'changelog', label: 'Changelog' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="font-bold text-stone-800">Panel de administración</p>
          <p className="text-xs text-stone-400">Tortas Fritas de Yecla</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>

      {/* If editing/adding restaurant */}
      {editingRestaurant !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-2xl max-h-[92vh] overflow-y-auto p-5">
            <AdminRestaurantForm
              restaurant={editingRestaurant === 'new' ? null : editingRestaurant}
              onSaved={handleSaved}
              onCancel={() => setEditingRestaurant(null)}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white sticky top-[61px] z-10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              'flex-1 py-3 text-sm font-semibold transition-colors relative',
              tab === t.key
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-stone-500',
            ].join(' ')}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* ── Restaurants ── */}
        {tab === 'restaurants' && (
          <div className="space-y-3">
            <button
              onClick={() => setEditingRestaurant('new')}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Plus size={18} />
              Añadir local
            </button>

            {restaurants.map((r) => (
              <div
                key={r.id}
                className={[
                  'bg-white rounded-xl border p-4 flex items-center justify-between',
                  r.isClosed ? 'border-stone-200 opacity-50' : 'border-stone-100',
                ].join(' ')}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 truncate">
                    {r.name}
                    {r.isClosed && (
                      <span className="ml-2 text-xs text-red-400 font-normal">
                        cerrado
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-stone-400 truncate">{r.address}</p>
                </div>
                <button
                  onClick={() => setEditingRestaurant(r)}
                  className="ml-3 p-2 rounded-lg hover:bg-stone-100 text-stone-500 shrink-0"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Suggestions ── */}
        {tab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.length === 0 && (
              <p className="text-center text-stone-400 py-8 text-sm">
                No hay sugerencias todavía
              </p>
            )}
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-stone-100 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-800">{s.name}</p>
                    {s.address && (
                      <p className="text-xs text-stone-500 mt-0.5">{s.address}</p>
                    )}
                    {s.notes && (
                      <p className="text-xs text-stone-400 mt-1 italic">{s.notes}</p>
                    )}
                    {s.contactEmail && (
                      <p className="text-xs text-stone-400 mt-1">{s.contactEmail}</p>
                    )}
                  </div>
                  <span
                    className={[
                      'shrink-0 text-xs font-semibold px-2 py-1 rounded-full',
                      s.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : s.status === 'added'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-500',
                    ].join(' ')}
                  >
                    {s.status === 'pending'
                      ? 'Pendiente'
                      : s.status === 'added'
                      ? 'Añadido'
                      : 'Revisado'}
                  </span>
                </div>
                {s.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSuggestionStatus(s.id, 'added')}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle size={14} />
                      Marcar como añadido
                    </button>
                    <button
                      onClick={() => handleSuggestionStatus(s.id, 'reviewed')}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                    >
                      <X size={14} />
                      Descartar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Changelog ── */}
        {tab === 'changelog' && (
          <div className="space-y-4">
            <form
              onSubmit={handleChangelogSubmit}
              className="bg-white rounded-xl border border-stone-100 p-4 space-y-3"
            >
              <p className="font-semibold text-stone-800">Nueva entrada</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Versión
                  </label>
                  <input
                    value={clVersion}
                    onChange={(e) => setClVersion(e.target.value)}
                    placeholder="1.0.1"
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={clDate}
                    onChange={(e) => setClDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Cambios (uno por línea)
                </label>
                <textarea
                  value={clChanges}
                  onChange={(e) => setClChanges(e.target.value)}
                  rows={4}
                  placeholder={'Añadido nuevo restaurante\nCorregido cálculo de puntuación'}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-amber-500 text-white font-semibold py-2.5 rounded-lg hover:bg-amber-600 disabled:bg-stone-200 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : clSaved ? (
                  <>
                    <CheckCircle size={16} />
                    Guardado
                  </>
                ) : (
                  'Publicar entrada'
                )}
              </button>
            </form>

            {/* Existing entries */}
            <div className="space-y-3">
              {changelog.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-stone-100 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      v{entry.version}
                    </span>
                    <span className="text-xs text-stone-400">{entry.releaseDate}</span>
                  </div>
                  <ul className="space-y-1">
                    {(entry.changes ?? []).map((c, i) => (
                      <li key={i} className="text-sm text-stone-600 flex gap-2">
                        <span className="text-amber-500">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
