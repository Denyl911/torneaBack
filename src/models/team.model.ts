import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
// import { Tournament } from './tournament.model';

export const Team = pgTable('teams', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  tournament_id: integer().notNull(),
  group_id: integer(),
  // .references(() => Tournament.id),
  ...timestamps,
});
