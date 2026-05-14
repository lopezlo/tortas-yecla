'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { needsSetup, setupAdmin } from '@/lib/actions';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

export default function SetupPage() {
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    needsSetup().then((needs) => {
      if (!needs) router.push('/admin/login');
      else setReady(true);
    });
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username.trim() || username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    startTransition(async () => {
      const result = await setupAdmin(username.trim(), password);
      if (result.success) {
        router.push('/admin/login');
      } else {
        setError(result.error ?? 'Error al configurar el administrador');
      }
    });
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Configuración inicial</h1>
          <p className="text-stone-500 text-sm mt-1">
            Crea el usuario administrador
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Usuario
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              'Crear administrador'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
