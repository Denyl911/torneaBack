import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Standing } from '../models/standing.model';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { messageSchema } from '../utils/util';

const standingRouter = new Elysia({
  prefix: '/standings',
  detail: {
    tags: ['Standings']
  }
});

const selectSchema = createSelectSchema(Standing);
const insertSchema = createInsertSchema(Standing);
const updateSchema = createUpdateSchema(Standing);

standingRouter.get(
  '/',
  async () => {
    return await db.select().from(Standing);
  },
  { response: t.Array(selectSchema) }
);

standingRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db.select().from(Standing).where(eq(Standing.id, id));
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

standingRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Standing).values(body);
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

standingRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Standing)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(Standing.id, id));
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

standingRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Standing).where(eq(Standing.id, id));
    return { message: 'Standing deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
  }
);

export default standingRouter;
