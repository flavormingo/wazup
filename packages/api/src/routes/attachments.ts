import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Database } from '../db/database.js';
import { createAuthMiddleware } from '../middleware.js';
import { getPresignedPost, getPublicUrl } from '../storage.js';
import { config } from '../config.js';
import { nanoid } from 'nanoid';

const MAX_ATTACHMENT_SIZE = 20 * 1024 * 1024;

export function attachmentRoutes(app: FastifyInstance, db: Kysely<Database>) {
  const requireAuth = createAuthMiddleware(db);

  app.post('/api/attachments/presign', { preHandler: requireAuth }, async (request, reply) => {
    const { filename, content_type, size } = request.body as {
      filename: string;
      content_type: string;
      size: number;
    };

    if (!filename || !content_type || !size) {
      return reply.status(400).send({ error: 'filename, content_type, and size are required' });
    }

    if (size <= 0) {
      return reply.status(400).send({ error: 'Invalid file size' });
    }

    if (size > MAX_ATTACHMENT_SIZE) {
      return reply.status(413).send({ error: 'File too large. Max 20MB' });
    }

    const safeName = filename.replace(/[/\\]/g, '_').replace(/\.\./g, '_');
    const key = `attachments/${nanoid()}/${safeName}`;
    const post = await getPresignedPost(config.minioBucket, key, MAX_ATTACHMENT_SIZE);

    const attachment = await db
      .insertInto('attachments')
      .values({
        message_id: null as any,
        filename,
        content_type,
        size,
        storage_key: key,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      attachment_id: attachment.id,
      post_url: post.url,
      fields: post.fields,
      public_url: getPublicUrl(key),
    };
  });
}
