import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Team } from '../models/team.model';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { messageSchema } from '../utils/util';

const teamRouter = new Elysia({
  prefix: '/teams',
  detail: {
    tags: ['Teams'],
  },
});

const selectSchema = createSelectSchema(Team);
const insertSchema = createInsertSchema(Team);
const updateSchema = createUpdateSchema(Team);

teamRouter.get(
  '/',
  async () => {
    return await db.select().from(Team);
  },
  { response: t.Array(selectSchema) }
);

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
    response: {
      200: selectSchema,
      404: messageSchema,
    },
  }
);

teamRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Team).values(body);
    return {
      message: 'success',
    };
  },
  {
    body: insertSchema,
    response: {
      201: messageSchema,
    },
  }
);

teamRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Team)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(Team.id, id));
    return {
      message: 'success',
    };
  },
  {
    body: updateSchema,
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
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
    response: {
      200: messageSchema,
    },
  }
);

teamRouter.get(
  '/tournament/:id',
  async ({ params: { id } }) => {
    return await db.select().from(Team).where(eq(Team.tournamentId, id));
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: t.Array(selectSchema),
  }
);

export default teamRouter;
