import type { FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Database } from '../db/database.js';
import { createAuthMiddleware } from '../middleware.js';
import { computePermissions } from '../permissions.js';
import { Permissions, hasPermission } from '@wazup/shared';
import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { config } from '../config.js';

export function voiceRoutes(app: FastifyInstance, db: Kysely<Database>) {
  const requireAuth = createAuthMiddleware(db);

  app.post('/api/channel/:channelId/voice-token', { preHandler: requireAuth }, async (request, reply) => {
    const { channelId } = request.params as { channelId: string };

    const channel = await db
      .selectFrom('channels')
      .selectAll()
      .where('id', '=', channelId)
      .executeTakeFirst();

    if (!channel) return reply.status(404).send({ error: 'Channel not found' });
    if (channel.type !== 'voice') return reply.status(400).send({ error: 'Not a voice channel' });

    const perms = await computePermissions(db, request.userId!, channel.club_id);
    if (!hasPermission(perms, Permissions.CONNECT_VOICE)) {
      return reply.status(403).send({ error: 'Missing CONNECT_VOICE permission' });
    }

    const canPublish = hasPermission(perms, Permissions.SPEAK);
    const canScreen = hasPermission(perms, Permissions.STREAM);

    const at = new AccessToken(config.livekitApiKey, config.livekitApiSecret, {
      identity: request.userId!,
      name: request.user!.username,
      ttl: '1h',
    });

    at.addGrant({
      room: `channel-${channelId}`,
      roomJoin: true,
      canPublish,
      canPublishData: true,
      canSubscribe: true,
      canPublishSources: [
        ...(canPublish ? [TrackSource.MICROPHONE, TrackSource.CAMERA] : []),
        ...(canScreen ? [TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO] : []),
      ],
    });

    const token = await at.toJwt();
    return {
      token,
      url: config.livekitPublicUrl || config.livekitUrl,
      room: `channel-${channelId}`,
    };
  });
}
