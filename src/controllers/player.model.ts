import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Player } from '../models/player.model';

const playerRouter = new Elysia({
  prefix: '/tournaments',
});

playerRouter.get('/', async () => await db.select().from(Player));

playerRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db.select().from(Player).where(eq(Player.id, id));
    if (!data) {
      return error(404, {
        message: 'Not found',
      });
    }
    return data[0];
  },
  {
    params: t.Object({ id: t.Integer() }),
  }
);

type newPlayer = typeof Player.$inferInsert;
playerRouter.post(
  '/',
  async ({ body, set }: { body: newPlayer; set: { status: number } }) => {
    set.status = 201;
    await db.insert(Player).values(body);
    return {
      message: 'success',
    };
  }
);

playerRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    return await db
      .update(Player)
      .set({ updated_at: new Date(), ...body })
      .where(eq(Player.id, id))
      .returning();
  },
  {
    body: t.Object({
      name: t.Optional(t.String()),
      birthdate: t.Optional(t.Date({t})),
      position: t.Optional(t.String()),
      team_id: t.Optional(t.Integer()),
    }),
    params: t.Object({ id: t.Integer() }),
  }
);

playerRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Player).where(eq(Player.id, id));
    return { message: 'Player deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
  }
);

export default playerRouter;
