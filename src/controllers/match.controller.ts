import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Match } from '../models/match.model';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { messageSchema } from '../utils/util';

const matchRouter = new Elysia({
  prefix: '/matches',
  detail: {
    tags: ['Matches']
  }
});

const selectSchema = createSelectSchema(Match);
const insertSchema = createInsertSchema(Match);
const updateSchema = createUpdateSchema(Match);

matchRouter.get(
  '/',
  async () => {
    return await db.select().from(Match);
  },
  { response: t.Array(selectSchema) }
);

matchRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db.select().from(Match).where(eq(Match.id, id));
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

matchRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Match).values(body);
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

matchRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Match)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(Match.id, id));
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

matchRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Match).where(eq(Match.id, id));
    return { message: 'Match deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
  }
);

export default matchRouter;
