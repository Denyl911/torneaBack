import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-typebox';
import db from '../config/db.config';
import { User } from '../models/user.model';
import { messageSchema } from '../utils/util';

const userRouter = new Elysia({
  prefix: '/users',
  detail: {
    tags: ['Users'],
  },
});

const selectSchema = createSelectSchema(User);
const insertSchema = createInsertSchema(User);
const updateSchema = createUpdateSchema(User);

userRouter.get('/', async () => await db.select().from(User), {
  response: t.Array(selectSchema),
});

userRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const user = await db.select().from(User).where(eq(User.id, id));
    if (!user) {
      return error(404, {
        message: 'Correo no registrado',
      });
    }
    return user[0];
  },
  {
    params: t.Object({ id: t.String() }),
    response: {
      200: selectSchema,
      404: messageSchema,
    },
  }
);

userRouter.post(
  '/',
  async ({ body, set }) => {
    set.status = 201;
    return await db.insert(User).values(body).returning({ id: User.id });
  },
  {
    body: insertSchema,
    response: {
      201: messageSchema,
    },
  }
);

userRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    await db
      .update(User)
      .set({ updatedAt: new Date(), ...body })
      .where(eq(User.id, id));
    return {
      message: 'success',
    };
  },
  {
    body: updateSchema,
    params: t.Object({ id: t.String() }),
    response: {
      200: messageSchema,
    },
  }
);

userRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(User).where(eq(User.id, id));
    return { message: 'User deleted' };
  },
  {
    params: t.Object({ id: t.String() }),
  }
);

export default userRouter;
