import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Team } from '../models/team.model';

const teamRouter = new Elysia({
  prefix: '/teams',
});

teamRouter.get('/', async () => await db.select().from(Team));

teamRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db.select().from(Team).where(eq(Team.id, id));
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

type newTeam = typeof Team.$inferInsert;
teamRouter.post(
  '/',
  async ({ body, set }: { body: newTeam; set: { status: number } }) => {
    set.status = 201;
    await db.insert(Team).values(body);
    return {
      message: 'success',
    };
  }
);

teamRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    return await db
      .update(Team)
      .set({ updated_at: new Date(), ...body })
      .where(eq(Team.id, id))
      .returning();
  },
  {
    body: t.Object({
      name: t.Optional(t.String()),
      tournament_id: t.Optional(t.Integer()),
      group_id: t.Optional(t.Integer()),
    }),
    params: t.Object({ id: t.Integer() }),
  }
);

teamRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Team).where(eq(Team.id, id));
    return { message: 'Team deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
  }
);

export default teamRouter;
