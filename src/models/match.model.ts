import { date, integer, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
import { Team } from './team.model';
import { Tournament } from './tournament.model';

export const statusEnum = pgEnum('status', [
  'Pendiente',
  'En Juego',
  'Finalizado',
]);

export const Match = pgTable('matches', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournamentId: integer('tournament_id')
    .notNull()
    .references(() => Tournament.id),
  homeId: integer('home_id')
    .notNull()
    .references(() => Team.id),
  awayId: integer('away_id')
    .notNull()
    .references(() => Team.id),
  homeGoals: integer('home_goals'),
  awayGoals: integer('away_goals'),
  date: date(),
  status: statusEnum(),
  ...timestamps,
});
