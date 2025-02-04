import { boolean, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const User = pgTable('users', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text(),
  age: integer().notNull(),
  ...timestamps,
});
