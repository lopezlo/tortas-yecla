'use client';

import dynamic from 'next/dynamic';

const MapWrapper = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-stone-100 flex items-center justify-center rounded-none">
      <p className="text-stone-400 text-sm">Cargando mapa…</p>
    </div>
  ),
});

export default MapWrapper;
