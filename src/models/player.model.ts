import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const Player = pgTable('players', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date(),
  position: varchar({ length: 100 }),
  team_id: integer().notNull(),
  ...timestamps,
});
