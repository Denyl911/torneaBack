import { date, integer, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const statusEnum = pgEnum('status', [
  'Pendiente',
  'En Juego',
  'Finalizado',
]);

export const Match = pgTable('matches', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournament_id: integer().notNull(),
  home_id: integer().notNull(),
  away_id: integer().notNull(),
  home_goal: integer(),
  away_goal: integer(),
  date: date(),
  status: statusEnum(),
  ...timestamps,
});
