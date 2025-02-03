import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import userRouter from './controllers/user.controller';
import tournamentRouter from './controllers/tournament.controller';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello Elysia')
  .use(swagger())
  .use(userRouter)
  .use(tournamentRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
