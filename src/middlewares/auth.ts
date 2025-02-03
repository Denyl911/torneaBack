import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { eq } from 'drizzle-orm';
import { userModel, User } from '../models/user.model';
import db from '../config/db.config';

const authMiddleware = (app: Elysia) =>
  app
    .use(
      jwt({
        name: 'jwt',
        secret: process.env.T_JWT_SECRET!,
      })
    )
    .derive(async ({ jwt, cookie: { accessToken }, set, error }) => {
      if (!accessToken.value) {
        // handle error for access token is not available
        set.status = 400;
        throw new Error('Access token is missing');
      }
      const jwtPayload = await jwt.verify(accessToken.value);
      if (!jwtPayload) {
        // handle error for access token is tempted or incorrect
        set.status = 403;
        throw new Error('Access token is invalid');
      }

      const userId = Number(jwtPayload.sub);
      const user = await db
        .select(userModel)
        .from(User)
        .where(eq(User.id, userId));

      if (!user) {
        // handle error for user not found from the provided access token
        set.status = 403;
        throw new Error('Access token is invalid');
      }

      return {
        user: user[0],
      };
    });

export default authMiddleware;
