import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const Group = pgTable('groups', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournament_id: integer().notNull(),
  name: varchar().notNull(),
  ...timestamps,
});
