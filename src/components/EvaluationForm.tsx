'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import RatingControl from './RatingControl';
import ReviewModal from './ReviewModal';
import { RATING_PARAMS, type ScoreKey } from '@/lib/utils';

type Restaurant = { id: string; name: string; address: string };

interface EvaluationFormProps {
  restaurants: Restaurant[];
}

type ScoreState = Record<ScoreKey, number>;

const defaultScores: ScoreState = {
  sizeScore: 0,
  flavorScore: 0,
  doughScore: 0,
  fillingScore: 0,
  oilScore: 0,
};

export default function EvaluationForm({ restaurants }: EvaluationFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [restaurantId, setRestaurantId] = useState('');
  const [visitDate, setVisitDate] = useState(today);
  const [scores, setScores] = useState<ScoreState>(defaultScores);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedRestaurant = restaurants.find((r) => r.id === restaurantId);

  function validate() {
    const e: Record<string, string> = {};
    if (!restaurantId) e.restaurant = 'Selecciona un local';
    if (!visitDate) e.visitDate = 'Selecciona una fecha';
    RATING_PARAMS.forEach((p) => {
      if (!scores[p.key]) e[p.key] = 'Selecciona una puntuación';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePreview() {
    if (validate()) setShowReview(true);
  }

  function handleSuccess() {
    setShowReview(false);
    setSubmitted(true);
    setRestaurantId('');
    setVisitDate(today);
    setScores(defaultScores);
    setErrors({});
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-6">
        <div className="w-20 h-20 bg-stone-950 rounded-full flex items-center justify-center">
          <CheckCircle size={36} className="text-amber-400" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-stone-950 tracking-tight leading-tight">
            ¡Gracias por<br />evaluar!
          </h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed max-w-xs">
            Tu valoración ayuda a descubrir las mejores tortas fritas de Yecla.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-stone-950 text-white font-bold px-8 py-4 rounded-full hover:bg-stone-800 transition-colors text-sm tracking-wide"
        >
          Evaluar otro local
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#161b27] rounded-b-[2.5rem] px-5 pt-12 pb-10">
        {/* Gradient blobs */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-amber-500 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute top-16 -left-10 w-40 h-40 bg-orange-600 rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Yecla · Murcia</span>
          </div>
          <h1 className="text-[2.6rem] font-black text-white tracking-tight leading-[1.05]">
            Tortas<br />Fritas.
          </h1>
          <p className="mt-3 text-white/50 text-sm font-medium">
            Evalúa tu local favorito y ayuda a la comunidad
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-3 mt-3 bg-white rounded-3xl overflow-hidden">
        <div className="px-5 pt-6 pb-7 space-y-6">

          {/* Local */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Local
            </label>
            <div className="relative">
              <select
                value={restaurantId}
                onChange={(e) => {
                  setRestaurantId(e.target.value);
                  setErrors((prev) => ({ ...prev, restaurant: '' }));
                }}
                className={[
                  'w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm outline-none transition-all appearance-none',
                  errors.restaurant
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : restaurantId
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-100 bg-stone-50 text-stone-400 focus:border-stone-300',
                ].join(' ')}
              >
                <option value="">Selecciona un local…</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-white text-stone-900">
                    {r.name}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs ${restaurantId ? 'text-stone-400' : 'text-stone-400'}`}>
                ▾
              </div>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${errors.restaurant ? 'text-red-500' : 'invisible'}`}>
              {errors.restaurant || 'x'}
            </p>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Fecha de visita
            </label>
            <input
              type="date"
              value={visitDate}
              max={today}
              onChange={(e) => {
                setVisitDate(e.target.value);
                setErrors((prev) => ({ ...prev, visitDate: '' }));
              }}
              className={[
                'w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm outline-none transition-all',
                errors.visitDate
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-stone-100 bg-stone-50 text-stone-800 focus:border-stone-950',
              ].join(' ')}
            />
            <p className={`text-xs font-semibold mt-0.5 ${errors.visitDate ? 'text-red-500' : 'invisible'}`}>
              {errors.visitDate || 'x'}
            </p>
          </div>
        </div>
      </div>

      {/* Ratings card */}
      <div className="mx-3 mt-3 bg-white rounded-3xl overflow-hidden">
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">Evaluación</p>
        </div>
        <div className="px-5 pt-4 pb-6 space-y-7 divide-y divide-stone-50">
          {RATING_PARAMS.map((param) => (
            <div key={param.key} className="pt-5 first:pt-0">
              <RatingControl
                label={param.label}
                description={param.description}
                labels={param.labels}
                value={scores[param.key]}
                onChange={(v) => {
                  setScores((prev) => ({ ...prev, [param.key]: v }));
                  setErrors((prev) => ({ ...prev, [param.key]: '' }));
                }}
                error={errors[param.key]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-3 mt-3 mb-2">
        <button
          onClick={handlePreview}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white font-black py-5 rounded-full transition-all text-base tracking-wide shadow-lg shadow-amber-300/50"
        >
          Revisar y enviar →
        </button>
      </div>

      {showReview && selectedRestaurant && (
        <ReviewModal
          formData={{
            restaurantId,
            restaurantName: selectedRestaurant.name,
            restaurantAddress: selectedRestaurant.address,
            visitDate,
            ...scores,
          }}
          onClose={() => setShowReview(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
