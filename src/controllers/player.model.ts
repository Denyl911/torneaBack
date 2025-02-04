import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { Player } from '../models/player.model';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import { messageSchema } from '../utils/util';

const playerRouter = new Elysia({
  prefix: '/players',
  detail: {
    tags: ['Players'],
  },
});

const selectSchema = createSelectSchema(Player);
const insertSchema = createInsertSchema(Player);
const updateSchema = createUpdateSchema(Player);

playerRouter.get(
  '/',
  async () => {
    return await db.select().from(Player);
  },
  { response: t.Array(selectSchema) }
);

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
    response: {
      200: selectSchema,
      404: messageSchema,
    },
  }
);

playerRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    await db.insert(Player).values(body);
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

playerRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(Player)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(Player.id, id));
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

playerRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(Player).where(eq(Player.id, id));
    return { message: 'Player deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: {
      200: messageSchema,
    },
  }
);

playerRouter.get(
  '/team/:id',
  async ({ params: { id } }) => {
    return await db.select().from(Player).where(eq(Player.teamId, id));
  },
  {
    params: t.Object({ id: t.Integer() }),
    response: t.Array(selectSchema),
  }
);

export default playerRouter;
