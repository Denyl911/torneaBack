import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Group } from '../models/group.model';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { messageSchema } from '../utils/util';

const groupRouter = new Elysia({
  prefix: '/groups',
  detail: {
    tags: ['Groups']
  }
});

const selectSchema = createSelectSchema(Group);
const insertSchema = createInsertSchema(Group);
const updateSchema = createUpdateSchema(Group);

groupRouter.get(
  '/',
  async () => {
    return await db.select().from(Group);
  },
  { response: t.Array(selectSchema) }
);

groupRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const data = await db.select().from(Group).where(eq(Group.id, id));
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

groupRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Group).values(body);
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

groupRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Group)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(Group.id, id));
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

groupRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Group).where(eq(Group.id, id));
    return { message: 'Group deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
  }
);

export default groupRouter;
