import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Database } from '../db/database.js';
import { createAuthMiddleware } from '../middleware.js';
import { getPresignedPutUrl, getPublicUrl } from '../storage.js';
import { config } from '../config.js';
import { nanoid } from 'nanoid';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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

    const isImage = content_type.startsWith('image/');
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
    if (size > maxSize) {
      return reply.status(413).send({
        error: `File too large. Max ${isImage ? '10MB for images' : '25MB'}`,
      });
    }

    const safeName = filename.replace(/[/\\]/g, '_').replace(/\.\./g, '_');
    const key = `attachments/${nanoid()}/${safeName}`;
    const uploadUrl = await getPresignedPutUrl(config.minioBucket, key);

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
      upload_url: uploadUrl,
      public_url: getPublicUrl(key),
    };
  });
}
