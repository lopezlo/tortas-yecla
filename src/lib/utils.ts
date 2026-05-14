import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '—';
  return (score * 2).toFixed(1);
}

export function scoreToStars(score: number | null | undefined): number {
  if (score === null || score === undefined || isNaN(score)) return 0;
  return Math.round(score * 10) / 10;
}

export const DAYS_ES = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
] as const;

export const DAYS_SHORT: Record<string, string> = {
  lunes: 'L',
  martes: 'M',
  miércoles: 'X',
  jueves: 'J',
  viernes: 'V',
  sábado: 'S',
  domingo: 'D',
};

export const RATING_PARAMS = [
  {
    key: 'sizeScore' as const,
    label: 'Tamaño',
    description: 'Tan grande como el plato',
    labels: ['Muy pequeña', 'Normal', 'Muy grande'] as [string, string, string],
  },
  {
    key: 'flavorScore' as const,
    label: 'Sabor',
    description: 'Ligeramente salado, sin harina cruda',
    labels: ['Insípida', 'Normal', 'Sabrosa'] as [string, string, string],
  },
  {
    key: 'doughScore' as const,
    label: 'Masa',
    description: 'Flexible y crujiente, se puede enrollar',
    labels: ['Nada', 'Normal', 'Perfecta'] as [string, string, string],
  },
  {
    key: 'fillingScore' as const,
    label: 'Relleno',
    description: 'Cantidad y calidad del relleno',
    labels: ['Pobre', 'Normal', 'Perfecto'] as [string, string, string],
  },
  {
    key: 'oilScore' as const,
    label: 'Aceite',
    description: 'Punto justo de aceite',
    labels: ['Aceitosa', 'Normal', 'Perfecta'] as [string, string, string],
  },
] as const;

export type ScoreKey = (typeof RATING_PARAMS)[number]['key'];
