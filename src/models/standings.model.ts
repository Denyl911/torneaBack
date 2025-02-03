import { integer, pgTable } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const Standing = pgTable('standings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournament_id: integer().notNull(),
  team_id: integer().notNull(),
  points: integer(),
  m_played: integer(),
  goals_f: integer(),
  goals_a: integer(),
  ...timestamps,
});
