import { date, integer, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const typeEnum = pgEnum('type', [
  'liga',
  'eliminacion_directa',
  'grupos_eliminacion',
  'doble_eliminacion',
  'suizo',
]);

export const Tournament = pgTable('tournaments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  type: typeEnum().notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  ...timestamps,
});
