import { t } from 'elysia';

export function getExpTimestamp(seconds: number) {
  const currentTimeMillis = Date.now();
  const secondsIntoMillis = seconds * 1000;
  const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

  return Math.floor(expirationTimeMillis / 1000);
}

export const messageSchema = t.Object({
  message: t.String(),
});
