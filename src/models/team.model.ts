import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
import { Tournament } from './tournament.model';
import { Group } from './group.model';

export const Team = pgTable('teams', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  tournamentId: integer('tournament_id')
    .notNull()
    .references(() => Tournament.id),
  groupId: integer('group_id').references(() => Group.id),
  ...timestamps,
});
