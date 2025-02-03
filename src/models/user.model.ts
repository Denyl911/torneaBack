import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';

export const User = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const userModel = {
  id: User.id,
  email: User.email,
  name: User.name,
  age: User.age,
  updated_at: User.updated_at,
  created_at: User.created_at,
};
