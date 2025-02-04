import { timestamp } from 'drizzle-orm/pg-core';

const timestamps = {
  updatedAt: timestamp('created_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
};

export default timestamps;
