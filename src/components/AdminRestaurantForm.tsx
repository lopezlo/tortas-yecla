'use client';

import { useState, useTransition } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { adminCreateRestaurant, adminUpdateRestaurant } from '@/lib/actions';
import { DAYS_ES } from '@/lib/utils';
import type { Restaurant } from '@/lib/schema';

interface AdminRestaurantFormProps {
  restaurant?: Restaurant | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function AdminRestaurantForm({
  restaurant,
  onSaved,
  onCancel,
}: AdminRestaurantFormProps) {
  const isEditing = !!restaurant;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [name, setName] = useState(restaurant?.name ?? '');
  const [address, setAddress] = useState(restaurant?.address ?? '');
  const [lat, setLat] = useState(restaurant?.lat?.toString() ?? '');
  const [lng, setLng] = useState(restaurant?.lng?.toString() ?? '');
  const [daysOpen, setDaysOpen] = useState<string[]>(restaurant?.daysOpen ?? []);
  const [isClosed, setIsClosed] = useState(restaurant?.isClosed ?? false);

  function toggleDay(day: string) {
    setDaysOpen((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !address.trim()) {
      setError('Nombre y dirección son obligatorios');
      return;
    }

    const data = {
      name: name.trim(),
      address: address.trim(),
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      daysOpen,
      isClosed,
    };

    startTransition(async () => {
      const result = isEditing
        ? await adminUpdateRestaurant(restaurant.id, data)
        : await adminCreateRestaurant(data);

      if (result.success) {
        onSaved();
      } else {
        setError('Error al guardar');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-stone-800 text-lg">
          {isEditing ? 'Editar local' : 'Nuevo local'}
        </h3>
        <button type="button" onClick={onCancel} className="p-1 hover:bg-stone-100 rounded-full">
          <X size={20} className="text-stone-500" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
          placeholder="Bar La Abuela"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
          placeholder="Calle Mayor 1, Yecla"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Latitud (opcional)
          </label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
            placeholder="38.6167"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Longitud (opcional)
          </label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
            placeholder="-1.1167"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Días con tortas fritas
        </label>
        <div className="flex gap-2 flex-wrap">
          {DAYS_ES.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize',
                daysOpen.includes(day)
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-white border-stone-200 text-stone-500 hover:border-amber-300',
              ].join(' ')}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isClosed}
          onChange={(e) => setIsClosed(e.target.checked)}
          className="w-4 h-4 accent-red-500"
        />
        <span className="text-sm text-stone-700">Local cerrado (ocultar del listado)</span>
      </label>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 transition-colors flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isPending ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
