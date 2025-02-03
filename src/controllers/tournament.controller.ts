import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import db from '../config/db.config';
import { Tournament } from '../models/tournament.model';
import { messageSchema } from '../helpers/util';

const tournamentRouter = new Elysia({
  prefix: '/tournaments',
});

const selectSchema = createSelectSchema(Tournament);
tournamentRouter.get('/', async () => {
  return await db.select().from(Tournament);
});

tournamentRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db
      .select()
      .from(Tournament)
      .where(eq(Tournament.id, id));
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

const insertSchema = createInsertSchema(Tournament);
tournamentRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Tournament).values(body);
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

const updateSchema = createUpdateSchema(Tournament);
tournamentRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Tournament)
      .set({ updated_at: new Date(), ...body })
      .where(eq(Tournament.id, id));
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

tournamentRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Tournament).where(eq(Tournament.id, id));
    return { message: 'Tournament deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
  }
);

export default tournamentRouter;
