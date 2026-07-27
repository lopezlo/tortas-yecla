'use server';

import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import {
  restaurants,
  evaluations,
  suggestions,
  changelog,
  adminUsers,
} from '@/lib/schema';
import { eq, desc, avg, count, sql, or, isNull } from 'drizzle-orm';
import { refresh } from 'next/cache';
import bcrypt from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MailChecker = require('mailchecker') as { isValid: (email: string) => boolean };

// ─── Public queries ────────────────────────────────────────────────────────

export async function getActiveRestaurants() {
  return db
    .select({ id: restaurants.id, name: restaurants.name, address: restaurants.address })
    .from(restaurants)
    .where(or(eq(restaurants.isClosed, false), isNull(restaurants.isClosed)))
    .orderBy(restaurants.name);
}

export type RankingRow = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  daysOpen: string[] | null;
  evalCount: number;
  avgSize: number | null;
  avgFlavor: number | null;
  avgDough: number | null;
  avgFilling: number | null;
  avgOil: number | null;
  totalScore: number | null;
};

export async function getRankings(): Promise<RankingRow[]> {
  const rows = await db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      address: restaurants.address,
      lat: restaurants.lat,
      lng: restaurants.lng,
      daysOpen: restaurants.daysOpen,
      evalCount: count(evaluations.id),
      avgSize: avg(evaluations.sizeScore),
      avgFlavor: avg(evaluations.flavorScore),
      avgDough: avg(evaluations.doughScore),
      avgFilling: avg(evaluations.fillingScore),
      avgOil: avg(evaluations.oilScore),
      totalScore: sql<number>`
        CASE WHEN COUNT(${evaluations.id}) = 0 THEN NULL
        ELSE (
          AVG(${evaluations.sizeScore}) +
          AVG(${evaluations.flavorScore}) +
          AVG(${evaluations.doughScore}) +
          AVG(${evaluations.fillingScore}) +
          AVG(${evaluations.oilScore})
        ) / 5.0
        END
      `,
    })
    .from(restaurants)
    .leftJoin(evaluations, eq(restaurants.id, evaluations.restaurantId))
    .where(or(eq(restaurants.isClosed, false), isNull(restaurants.isClosed)))
    .groupBy(restaurants.id)
    .orderBy(
      sql`CASE WHEN COUNT(${evaluations.id}) = 0 THEN 1 ELSE 0 END`,
      sql`(
        AVG(${evaluations.sizeScore}) +
        AVG(${evaluations.flavorScore}) +
        AVG(${evaluations.doughScore}) +
        AVG(${evaluations.fillingScore}) +
        AVG(${evaluations.oilScore})
      ) / 5.0 DESC NULLS LAST`
    );

  return rows.map((r) => ({
    ...r,
    daysOpen: r.daysOpen?.map((d) => d.toLowerCase()) ?? null,
    evalCount: Number(r.evalCount),
    avgSize: r.avgSize ? Number(r.avgSize) : null,
    avgFlavor: r.avgFlavor ? Number(r.avgFlavor) : null,
    avgDough: r.avgDough ? Number(r.avgDough) : null,
    avgFilling: r.avgFilling ? Number(r.avgFilling) : null,
    avgOil: r.avgOil ? Number(r.avgOil) : null,
    totalScore: r.totalScore ? Number(r.totalScore) : null,
  }));
}

export async function getMapRestaurants() {
  return db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      address: restaurants.address,
      lat: restaurants.lat,
      lng: restaurants.lng,
    })
    .from(restaurants)
    .where(or(eq(restaurants.isClosed, false), isNull(restaurants.isClosed)));
}

export async function getChangelog() {
  return db
    .select()
    .from(changelog)
    .orderBy(desc(changelog.releaseDate));
}

// ─── Public mutations ──────────────────────────────────────────────────────

export type EvaluationInput = {
  restaurantId: string;
  visitDate: string;
  sizeScore: number;
  flavorScore: number;
  doughScore: number;
  fillingScore: number;
  oilScore: number;
  email: string;
  acceptsCommercial: boolean;
};

export async function submitEvaluation(data: EvaluationInput) {
  if (!MailChecker.isValid(data.email)) {
    return {
      success: false,
      error: 'Por favor usa un correo electrónico válido (no se permiten correos temporales)',
    };
  }

  const scores = [
    data.sizeScore,
    data.flavorScore,
    data.doughScore,
    data.fillingScore,
    data.oilScore,
  ];
  if (scores.some((s) => s < 1 || s > 5)) {
    return { success: false, error: 'Puntuaciones inválidas' };
  }

  const [restaurant] = await db
    .select({ address: restaurants.address })
    .from(restaurants)
    .where(eq(restaurants.id, data.restaurantId))
    .limit(1);

  await db.insert(evaluations).values({
    id: randomUUID(),
    restaurantId: data.restaurantId,
    visitDate: new Date(data.visitDate),
    sizeScore: data.sizeScore,
    flavorScore: data.flavorScore,
    doughScore: data.doughScore,
    fillingScore: data.fillingScore,
    oilScore: data.oilScore,
    email: data.email,
    acceptsCommercial: data.acceptsCommercial,
    location: restaurant?.address ?? null,
  });

  refresh();
  return { success: true };
}

export async function submitSuggestion(data: {
  name: string;
  address?: string;
  notes?: string;
  contactEmail?: string;
}) {
  await db.insert(suggestions).values({
    name: data.name,
    address: data.address,
    notes: data.notes,
    contactEmail: data.contactEmail,
  });
  return { success: true };
}

// ─── Admin queries ─────────────────────────────────────────────────────────

export async function adminGetAllRestaurants() {
  return db.select().from(restaurants).orderBy(restaurants.name);
}

export async function adminGetSuggestions() {
  return db
    .select()
    .from(suggestions)
    .orderBy(desc(suggestions.createdAt));
}

export async function adminGetChangelog() {
  return db
    .select()
    .from(changelog)
    .orderBy(desc(changelog.releaseDate));
}

// ─── Admin mutations ───────────────────────────────────────────────────────

export type RestaurantInput = {
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  daysOpen: string[];
  isClosed: boolean;
};

export async function adminCreateRestaurant(data: RestaurantInput) {
  await db.insert(restaurants).values({
    name: data.name,
    address: data.address,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    daysOpen: data.daysOpen,
    isClosed: data.isClosed,
  });
  refresh();
  return { success: true };
}

export async function adminUpdateRestaurant(id: string, data: RestaurantInput) {
  await db
    .update(restaurants)
    .set({
      name: data.name,
      address: data.address,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      daysOpen: data.daysOpen,
      isClosed: data.isClosed,
      updatedAt: new Date(),
    })
    .where(eq(restaurants.id, id));
  refresh();
  return { success: true };
}

export async function adminCreateChangelog(data: {
  version: string;
  releaseDate: string;
  changes: string[];
}) {
  await db.insert(changelog).values(data);
  refresh();
  return { success: true };
}

export async function adminUpdateSuggestionStatus(
  id: string,
  status: string
) {
  await db
    .update(suggestions)
    .set({ status })
    .where(eq(suggestions.id, id));
  refresh();
  return { success: true };
}

// ─── Setup ─────────────────────────────────────────────────────────────────

export async function needsSetup() {
  const [row] = await db.select().from(adminUsers).limit(1);
  return !row;
}

export async function setupAdmin(username: string, password: string) {
  const existing = await db.select().from(adminUsers).limit(1);
  if (existing.length > 0) {
    return { success: false, error: 'El administrador ya está configurado' };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(adminUsers).values({ username, passwordHash });
  return { success: true };
}
