import { Star } from 'lucide-react';

interface StarRatingProps {
  score: number; // 1–5 scale
  size?: number;
}

export default function StarRating({ score, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${score.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, score - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-stone-200"
              fill="currentColor"
              strokeWidth={0}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-amber-400"
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
