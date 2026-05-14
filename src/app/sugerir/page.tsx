'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { submitSuggestion } from '@/lib/actions';

export default function SugerirPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError('');
    setServerError('');
    if (!name.trim()) {
      setNameError('El nombre del local es obligatorio');
      return;
    }
    startTransition(async () => {
      const result = await submitSuggestion({
        name: name.trim(),
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError('Error al enviar la sugerencia');
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-6">
        <div className="w-20 h-20 bg-stone-950 rounded-full flex items-center justify-center">
          <CheckCircle size={36} className="text-amber-400" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-stone-950 tracking-tight leading-tight">
            ¡Gracias por<br />la sugerencia!
          </h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed max-w-xs">
            Revisaremos el local y lo añadiremos si cumple los requisitos.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setName(''); setAddress(''); setNotes(''); setContactEmail(''); }}
          className="bg-stone-950 text-white font-bold px-8 py-4 rounded-full hover:bg-stone-800 transition-colors text-sm tracking-wide"
        >
          Sugerir otro
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#161b27] rounded-b-[2.5rem] px-5 pt-12 pb-10">
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-emerald-500 rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute top-12 -left-8 w-40 h-40 bg-amber-500 rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Colabora</span>
          </div>
          <h1 className="text-[2.6rem] font-black text-white tracking-tight leading-[1.05]">
            Sugerir<br />Local.
          </h1>
          <p className="mt-3 text-white/50 text-sm font-medium">
            ¿Conoces un bar con buenas tortas fritas?
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="mx-3 mt-3 bg-white rounded-3xl overflow-hidden">
        <form onSubmit={handleSubmit} className="px-5 pt-6 pb-7 space-y-5">

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Nombre del local <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              placeholder="Bar La Peña"
              className={[
                'w-full px-4 py-3.5 rounded-2xl border-2 font-medium text-sm outline-none transition-all',
                nameError ? 'border-red-300 bg-red-50' : 'border-stone-100 bg-stone-50 text-stone-900 focus:border-stone-950',
              ].join(' ')}
            />
            <p className={`text-xs font-semibold ${nameError ? 'text-red-500' : 'invisible'}`}>
              {nameError || 'x'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Dirección <span className="text-stone-300">(opcional)</span>
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Mayor 10, Yecla"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-100 bg-stone-50 font-medium text-sm outline-none focus:border-stone-950 transition-all text-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Notas <span className="text-stone-300">(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Las hacen los jueves por la mañana, son enormes…"
              rows={3}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-100 bg-stone-50 font-medium text-sm outline-none focus:border-stone-950 transition-all text-stone-900 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.15em]">
              Tu correo <span className="text-stone-300">(para notificarte)</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="tu@correo.es"
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-100 bg-stone-50 font-medium text-sm outline-none focus:border-stone-950 transition-all text-stone-900"
            />
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-red-600">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-100 disabled:text-stone-300 text-white font-black py-5 rounded-full transition-all text-base tracking-wide shadow-lg shadow-amber-300/40 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <><Loader2 size={18} className="animate-spin" /> Enviando…</>
            ) : (
              'Enviar sugerencia →'
            )}
          </button>
        </form>
      </div>
    </>
  );
}
