import { getRankings } from '@/lib/actions';
import RestaurantCard from '@/components/RestaurantCard';
import { Trophy } from 'lucide-react';

export default async function RankingPage() {
  const rankings = await getRankings();

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#161b27] rounded-b-[2.5rem] px-5 pt-12 pb-10">
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-yellow-400 rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-8 w-44 h-44 bg-amber-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
            <Trophy size={11} className="text-amber-300" />
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">{rankings.length} locales</span>
          </div>
          <h1 className="text-[2.6rem] font-black text-white tracking-tight leading-[1.05]">
            Ranking<br />Yecla.
          </h1>
          <p className="mt-3 text-white/50 text-sm font-medium">
            Las mejores tortas fritas, ordenadas por puntuación
          </p>
        </div>
      </div>

      {rankings.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🍞</p>
          <p className="font-semibold">Aún no hay datos</p>
          <p className="text-sm mt-1">¡Sé el primero en evaluar!</p>
        </div>
      ) : (
        <div className="px-3 pt-1 space-y-2 pb-4">
          {rankings.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
