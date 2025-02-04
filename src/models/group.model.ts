import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
import { Tournament } from './tournament.model';

export const Group = pgTable('groups', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournamentId: integer('tournament_id')
    .notNull()
    .references(() => Tournament.id),
  name: varchar().notNull(),
  ...timestamps,
});
