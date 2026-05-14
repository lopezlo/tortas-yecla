'use client';

import { useState, useTransition } from 'react';
import { X, Loader2 } from 'lucide-react';
import { submitEvaluation, type EvaluationInput } from '@/lib/actions';
import { RATING_PARAMS } from '@/lib/utils';

interface ReviewModalProps {
  formData: {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    visitDate: string;
    sizeScore: number;
    flavorScore: number;
    doughScore: number;
    fillingScore: number;
    oilScore: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ formData, onClose, onSuccess }: ReviewModalProps) {
  const [email, setEmail] = useState('');
  const [acceptsCommercial, setAcceptsCommercial] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [privacyError, setPrivacyError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition] = useTransition();

  const scores = RATING_PARAMS.map((p) => ({
    label: p.label,
    value: formData[p.key],
  }));
  const totalAvg = scores.reduce((s, p) => s + p.value, 0) / scores.length;
  const totalOut10 = totalAvg * 2;

  function validate() {
    let ok = true;
    setEmailError('');
    setPrivacyError('');
    setServerError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Introduce un correo electrónico válido');
      ok = false;
    }
    if (!acceptsPrivacy) {
      setPrivacyError('Debes aceptar la política de privacidad');
      ok = false;
    }
    return ok;
  }

  function handleSubmit() {
    if (!validate()) return;
    startTransition(async () => {
      const payload: EvaluationInput = {
        restaurantId: formData.restaurantId,
        visitDate: formData.visitDate,
        sizeScore: formData.sizeScore,
        flavorScore: formData.flavorScore,
        doughScore: formData.doughScore,
        fillingScore: formData.fillingScore,
        oilScore: formData.oilScore,
        email,
        acceptsCommercial,
      };
      const result = await submitEvaluation(payload);
      if (result.success) {
        onSuccess();
      } else {
        setServerError(result.error ?? 'Error al enviar');
      }
    });
  }

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
          <h2 className="font-black text-stone-950 text-xl tracking-tight">Revisa tu evaluación</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 pb-safe">
          <div className="space-y-4 pb-8">

            {/* Score hero */}
            <div className="bg-stone-950 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Puntuación total</p>
                <p className="text-white font-black text-5xl leading-none mt-1">{totalOut10.toFixed(1)}</p>
                <p className="text-stone-500 text-xs mt-1">sobre 10</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">{formData.restaurantName}</p>
                <p className="text-stone-400 text-xs mt-0.5 max-w-[140px] text-right leading-relaxed">{formData.restaurantAddress}</p>
                <p className="text-amber-500 text-xs mt-1">{formData.visitDate}</p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="bg-stone-50 rounded-2xl p-4 space-y-3">
              {scores.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-stone-600 w-16 shrink-0">{s.label}</span>
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={[
                          'flex-1 h-6 rounded-md text-xs font-black flex items-center justify-center',
                          i === s.value
                            ? 'bg-stone-950 text-white'
                            : i < s.value
                            ? 'bg-stone-200 text-stone-400'
                            : 'bg-stone-100 text-stone-200',
                        ].join(' ')}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-black text-stone-950 w-8 text-right">{(s.value * 2).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="tu@correo.es"
                className={[
                  'w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm outline-none transition-all',
                  emailError
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-stone-100 bg-stone-50 text-stone-900 focus:border-stone-950',
                ].join(' ')}
              />
              {emailError && <p className="text-xs font-semibold text-red-500">{emailError}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className={[
                  'mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all',
                  acceptsCommercial ? 'bg-stone-950 border-stone-950' : 'border-stone-200',
                ].join(' ')}
                  onClick={() => setAcceptsCommercial(v => !v)}
                >
                  {acceptsCommercial && <span className="text-white text-xs font-black">✓</span>}
                </div>
                <span className="text-sm text-stone-500 leading-relaxed">
                  Acepto recibir comunicaciones sobre tortas fritas de Yecla
                </span>
              </label>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className={[
                    'mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all',
                    acceptsPrivacy ? 'bg-stone-950 border-stone-950' : privacyError ? 'border-red-400' : 'border-stone-200',
                  ].join(' ')}
                    onClick={() => { setAcceptsPrivacy(v => !v); setPrivacyError(''); }}
                  >
                    {acceptsPrivacy && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                  <span className="text-sm text-stone-500 leading-relaxed">
                    He leído y acepto la{' '}
                    <a href="/privacidad" target="_blank" className="text-stone-950 underline font-semibold">
                      política de privacidad
                    </a>{' '}
                    <span className="text-red-400">*</span>
                  </span>
                </label>
                {privacyError && <p className="mt-1 ml-8 text-xs font-semibold text-red-500">{privacyError}</p>}
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-red-600">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-100 disabled:text-stone-300 text-white font-black py-5 rounded-full transition-all text-base tracking-wide shadow-lg shadow-amber-300/40 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={18} className="animate-spin" /> Enviando...</>
              ) : (
                'Enviar evaluación →'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
