import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
import { Team } from './team.model';

export const Player = pgTable('players', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date(),
  position: varchar({ length: 100 }),
  teamId: integer('team_id').notNull().references(() => Team.id),
  ...timestamps,
});
