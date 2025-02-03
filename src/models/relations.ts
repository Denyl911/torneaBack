import { relations } from 'drizzle-orm';
import { Tournament } from './tournament.model';
import { Team } from './team.model';
import { Player } from './player.model';
import { Match } from './match.model';
import { Group } from './group.model';
import { Standing } from './standings.model';

export const teamsRealtions = relations(Team, ({ one, many }) => ({
  tournament: one(Tournament, {
    fields: [Team.tournament_id],
    references: [Tournament.id],
  }),
  players: many(Player),
  home_matches: many(Match, {
    relationName: 'homeTeam'
  }),
  away_matches: many(Match, {
    relationName: 'awayTeam'
  }),
  groups: one(Group, {
    fields: [Team.group_id],
    references: [Group.id],
  }),
}));

export const tournamentsRelations = relations(Tournament, ({ many }) => ({
  teams: many(Team),
  matches: many(Match),
  groups: many(Group),
  standingd: many(Standing),
}));

export const playerRelations = relations(Player, ({ one }) => ({
  team: one(Team, {
    fields: [Player.team_id],
    references: [Team.id],
  }),
}));

export const matchRelations = relations(Match, ({ one }) => ({
  tounament: one(Tournament, {
    fields: [Match.tournament_id],
    references: [Tournament.id],
  }),
  homeTeam: one(Team, {
    fields: [Match.home_id],
    references: [Team.id],
    relationName: 'homeTeam',
  }),
  awayTeam: one(Team, {
    fields: [Match.away_id],
    references: [Team.id],
    relationName: 'awayTeam',
  }),
}));

export const groupRelations = relations(Group, ({ one, many }) => ({
  tournament: one(Tournament, {
    fields: [Group.tournament_id],
    references: [Tournament.id],
  }),
  teams: many(Team),
}));

export const standingRelations = relations(Standing, ({ one }) => ({
  tournament: one(Tournament, {
    fields: [Standing.tournament_id],
    references: [Tournament.id],
  }),
  team: one(Team, {
    fields: [Standing.team_id],
    references: [Team.id],
  }),
}));
