import type { FastifyInstance } from 'fastify';
import { auth } from '../auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import type { Kysely } from 'kysely';
import type { Database } from '../db/database.js';
import { getPublicUrl } from '../storage.js';

export function authRoutes(app: FastifyInstance, db: Kysely<Database>) {
  app.get('/api/auth/me', async (request, reply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', session.user.id)
      .executeTakeFirst();

    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }

    const { rows } = await db.executeQuery<{ n: string }>(
      db.selectFrom('users')
        .select(db.fn.count('id').as('n'))
        .where('created_at', '<=', user.created_at)
        .compile()
    );
    const userNumber = Number(rows[0]?.n ?? 0);

    return {
      id: user.id,
      email: user.email,
      name: user.username,
      avatar_url: user.avatar_key ? getPublicUrl(user.avatar_key) : null,
      status_emoji: user.status_emoji,
      status_text: user.status_text,
      bio: user.bio,
      location: user.location,
      banner_url: user.banner_key ? getPublicUrl(user.banner_key) : null,
      link: user.link,
      connections: user.connections,
      created_at: user.created_at,
      user_number: userNumber,
    };
  });

  app.all('/api/auth/*', async (request, reply) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? JSON.stringify(request.body)
      : undefined;

    const webRequest = new Request(url.toString(), {
      method: request.method,
      headers: fromNodeHeaders(request.headers) as HeadersInit,
      body,
    });

    const response = await auth.handler(webRequest);

    reply.status(response.status);
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    const text = await response.text();
    return reply.send(text);
  });
}
