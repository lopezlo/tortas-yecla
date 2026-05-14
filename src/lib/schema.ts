import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  doublePrecision,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';

// Apunta a la tabla existente, mapeando los nombres de columna originales
export const restaurants = pgTable('restaurants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('location').notNull(),         // columna real: location
  lat: doublePrecision('latitude'),            // columna real: latitude
  lng: doublePrecision('longitude'),           // columna real: longitude
  daysOpen: text('torta_frita_days').array(),  // columna real: torta_frita_days
  isClosed: boolean('is_closed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const evaluations = pgTable('ratings', {
  id: uuid('id').defaultRandom().primaryKey(),
  restaurantId: uuid('restaurant_id')
    .references(() => restaurants.id)
    .notNull(),
  visitDate: timestamp('date'),
  sizeScore: integer('size').notNull(),
  flavorScore: integer('flavor').notNull(),
  doughScore: integer('dough').notNull(),
  fillingScore: integer('filling').notNull(),
  oilScore: integer('oil').notNull(),
  email: text('email'),
  acceptsCommercial: boolean('marketing_consent').default(false).notNull(),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const suggestions = pgTable('tf_suggestions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  notes: text('notes'),
  contactEmail: text('contact_email'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const changelog = pgTable('tf_changelog', {
  id: uuid('id').defaultRandom().primaryKey(),
  version: text('version').notNull(),
  releaseDate: date('release_date').notNull(),
  changes: text('changes').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminUsers = pgTable('tf_admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type Evaluation = typeof evaluations.$inferSelect;
export type Suggestion = typeof suggestions.$inferSelect;
export type ChangelogEntry = typeof changelog.$inferSelect;
