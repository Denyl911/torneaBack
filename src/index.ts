import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import userRouter from './controllers/user.controller';
import tournamentRouter from './controllers/tournament.controller';
import playerRouter from './controllers/player.model';
import matchRouter from './controllers/match.controller';
import groupRouter from './controllers/group.controller';
import standingRouter from './controllers/standings.model';
import teamRouter from './controllers/team.controller';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello Elysia')
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Tornea.me Documentation',
          version: '1.0.0',
        },
      },
    })
  )
  .use(userRouter)
  .use(tournamentRouter)
  .use(teamRouter)
  .use(playerRouter)
  .use(matchRouter)
  .use(groupRouter)
  .use(standingRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
