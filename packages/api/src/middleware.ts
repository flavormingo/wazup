import type { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from './auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import type { Kysely } from 'kysely';
import type { Database, UserRow } from './db/database.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    user?: UserRow;
  }
}

export function createAuthMiddleware(db: Kysely<Database>) {
  return async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
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

    request.userId = user.id;
    request.user = user;
  };
}

export function createOptionalAuthMiddleware(db: Kysely<Database>) {
  return async function optionalAuth(request: FastifyRequest) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) return;

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', session.user.id)
      .executeTakeFirst();

    if (user) {
      request.userId = user.id;
      request.user = user;
    }
  };
}
