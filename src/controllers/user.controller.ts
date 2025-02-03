import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { eq } from 'drizzle-orm';
import db from '../config/db.config';
import { User, userModel } from '../models/user.model';
import { getExpTimestamp } from '../helpers/util';
import authMiddleware from '../middlewares/auth';

const ACCESS_TOKEN_EXP = Number(process.env.ACCESS_TOKEN_EXP);
const REFRESH_TOKEN_EXP = Number(process.env.REFRESH_TOKEN_EXP);

const userRouter = new Elysia({
  prefix: '/users',
}).use(
  jwt({
    name: 'jwt',
    secret: process.env.T_JWT_SECRET!,
  })
);

userRouter.get('/', async () => await db.select(userModel).from(User));

userRouter.get(
  '/:id',
  async ({ params: { id }, error }) => {
    const user = await db.select(userModel).from(User).where(eq(User.id, id));
    if (!user) {
      return error(404, {
        message: 'Correo no registrado',
      });
    }
    return user[0];
  },
  {
    params: t.Object({ id: t.Integer() }),
  }
);

userRouter.post(
  '/',
  async ({ body, set }) => {
    body.password = await Bun.password.hash(body.password);
    set.status = 201;
    return await db.insert(User).values(body).returning({ id: User.id });
  },
  {
    body: t.Object({
      name: t.String(),
      age: t.Integer(),
      email: t.String({format: 'email'}),
      password: t.String({ minLength: 8 }),
    }),
  }
);

userRouter.put(
  '/:id',
  async ({ body, params: { id } }) => {
    return await db
      .update(User)
      .set({ updated_at: new Date(), ...body })
      .where(eq(User.id, id))
      .returning();
  },
  {
    body: t.Object({
      name: t.Optional(t.String()),
      age: t.Optional(t.Integer()),
      email: t.Optional(t.String()),
    }),
    params: t.Object({ id: t.Integer() }),
  }
);

userRouter.delete(
  '/:id',
  async ({ params: { id } }) => {
    await db.delete(User).where(eq(User.id, id));
    return { message: 'User deleted' };
  },
  {
    params: t.Object({ id: t.Integer() }),
  }
);

userRouter.post(
  '/login',
  async ({
    body: { email, password },
    jwt,
    cookie: { accessToken, refreshToken },
    error,
  }) => {
    const user: { id: number; email: string; password: string }[] = await db
      .select({
        id: User.id,
        email: User.email,
        password: User.password,
      })
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    if (user.length === 0) {
      return error(404, {
        message: 'Correo no registrado',
      });
    }

    const match = await Bun.password.verify(password, user[0].password);
    if (!match) {
      return error(401, {
        message: 'Contrasena incorrecta',
      });
    }
    accessToken.set({
      value: await jwt.sign({
        sub: String(user[0].id),
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      }),
      httpOnly: true,
      path: '/',
      maxAge: ACCESS_TOKEN_EXP,
    });
    refreshToken.set({
      value: await jwt.sign({
        sub: String(user[0].id),
        exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      }),
      httpOnly: true,
      path: '/',
      maxAge: REFRESH_TOKEN_EXP,
    });
    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      user: {
        id: String(user[0].id),
        email: user[0].email,
      },
    };
  },
  {
    body: t.Object({ email: t.String(), password: t.String() }),
  }
);

userRouter.post(
  '/logout',
  async ({ cookie: { accessToken, refreshToken } }) => {
    accessToken.remove();
    refreshToken.remove();

    return {
      message: 'Logout successfully',
    };
  }
);

userRouter.post(
  '/refresh',
  async ({ cookie: { accessToken, refreshToken }, jwt, error }) => {
    if (!refreshToken.value) {
      return error(400, {
        message: 'Refresh token is missing',
      });
    }
    const jwtPayload = await jwt.verify(refreshToken.value);
    if (!jwtPayload) {
      return error(403, {
        message: 'Refresh token is invalid',
      });
    }

    const userId = Number(jwtPayload.sub);
    const user = await db.select().from(User).where(eq(User.id, userId));

    if (!user) {
      return error(403, {
        message: 'Refresh token is invalid',
      });
    }

    // create new tokens
    accessToken.set({
      value: await jwt.sign({
        sub: String(user[0].id),
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      }),
      httpOnly: true,
      path: '/',
      maxAge: ACCESS_TOKEN_EXP,
    });
    refreshToken.set({
      value: await jwt.sign({
        sub: String(user[0].id),
        exp: getExpTimestamp(REFRESH_TOKEN_EXP),
      }),
      httpOnly: true,
      path: '/',
      maxAge: REFRESH_TOKEN_EXP,
    });

    // set refresh token in db

    return {
      message: 'Access token generated successfully',
      data: {
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      },
    };
  }
);

userRouter.use(authMiddleware).get('/profile', async ({ user }) => {
  return user;
});

export default userRouter;
