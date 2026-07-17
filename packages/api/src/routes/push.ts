import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import { sql } from 'kysely';
import type { Database } from '../db/database.js';
import { createAuthMiddleware } from '../middleware.js';
import { config } from '../config.js';
import type Redis from 'ioredis';

export function pushRoutes(app: FastifyInstance, db: Kysely<Database>, _redis: Redis) {
  const requireAuth = createAuthMiddleware(db);

  app.get('/api/push/vapid', async () => ({ publicKey: config.vapidPublicKey }));

  app.post('/api/push/subscribe', { preHandler: requireAuth }, async (request, reply) => {
    const { endpoint, keys, ua } = request.body as {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
      ua?: string;
    };
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return reply.status(400).send({ error: 'Invalid subscription' });
    }
    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, ua, failure_count, last_seen_at)
      VALUES (${request.userId!}, ${endpoint}, ${keys.p256dh}, ${keys.auth}, ${ua ?? null}, 0, now())
      ON CONFLICT (endpoint) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        ua = EXCLUDED.ua,
        failure_count = 0,
        last_seen_at = now()
    `.execute(db);
    return { ok: true };
  });

  app.delete('/api/push/subscribe', { preHandler: requireAuth }, async (request) => {
    const { endpoint } = request.body as { endpoint?: string };
    if (endpoint) {
      await db
        .deleteFrom('push_subscriptions')
        .where('endpoint', '=', endpoint)
        .where('user_id', '=', request.userId!)
        .execute();
    }
    return { ok: true };
  });

  app.get('/api/push/mutes', { preHandler: requireAuth }, async (request) => {
    const rows = await db
      .selectFrom('notification_settings')
      .select(['scope_type', 'scope_id'])
      .where('user_id', '=', request.userId!)
      .where('muted', '=', true)
      .execute();
    return rows;
  });

  app.post('/api/push/mute', { preHandler: requireAuth }, async (request, reply) => {
    const { scope_type, scope_id } = request.body as { scope_type?: string; scope_id?: string };
    if (!scope_type || !scope_id || !['club', 'channel', 'dm'].includes(scope_type)) {
      return reply.status(400).send({ error: 'Invalid scope' });
    }
    await sql`
      INSERT INTO notification_settings (user_id, scope_type, scope_id, muted)
      VALUES (${request.userId!}, ${scope_type}, ${scope_id}, true)
      ON CONFLICT (user_id, scope_type, scope_id) DO UPDATE SET muted = true
    `.execute(db);
    return { ok: true };
  });

  app.delete('/api/push/mute', { preHandler: requireAuth }, async (request, reply) => {
    const { scope_type, scope_id } = request.body as { scope_type?: string; scope_id?: string };
    if (!scope_type || !scope_id) {
      return reply.status(400).send({ error: 'Invalid scope' });
    }
    await db
      .deleteFrom('notification_settings')
      .where('user_id', '=', request.userId!)
      .where('scope_type', '=', scope_type)
      .where('scope_id', '=', scope_id)
      .execute();
    return { ok: true };
  });
}
