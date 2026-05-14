import { getMapRestaurants } from '@/lib/actions';
import MapWrapper from '@/components/MapWrapper';

export default async function MapaPage() {
  const restaurants = await getMapRestaurants();
  const withCoords = restaurants.filter((r) => r.lat && r.lng).length;

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)]">
      {/* Hero compacto */}
      <div className="bg-[#161b27] rounded-b-3xl px-5 pt-8 pb-6 shrink-0">
        <h1 className="text-2xl font-black text-white tracking-tight">Mapa.</h1>
        <p className="text-stone-400 text-xs font-medium mt-1">
          {withCoords} locales en el mapa
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <MapWrapper restaurants={restaurants} />
      </div>
    </div>
  );
}
