import { integer, pgTable } from 'drizzle-orm/pg-core';
import timestamps from './columns.helpers';
import { Tournament } from './tournament.model';
import { Team } from './team.model';

export const Standing = pgTable('standings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tournamentId: integer('tournament_id')
    .notNull()
    .references(() => Tournament.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => Team.id),
  points: integer(),
  mPlayed: integer('m_played'),
  goalsF: integer('goals_f'),
  goalsA: integer('goals_a'),
  ...timestamps,
});
