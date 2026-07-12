import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyWebsocket from '@fastify/websocket';
import { config } from './config.js';
import { createDb } from './db/database.js';
import { createRedis, createRedisSub } from './redis.js';
import { createMinioClient, ensureBucket } from './storage.js';
import { authRoutes } from './routes/auth.js';
import { clubRoutes } from './routes/clubs.js';
import { channelRoutes } from './routes/channels.js';
import { messageRoutes } from './routes/messages.js';
import { memberRoutes } from './routes/members.js';
import { roleRoutes } from './routes/roles.js';
import { inviteRoutes } from './routes/invites.js';
import { attachmentRoutes } from './routes/attachments.js';
import { voiceRoutes } from './routes/voice.js';
import { auditRoutes } from './routes/audit.js';
import { userRoutes } from './routes/users.js';
import { friendRoutes } from './routes/friends.js';
import { dmRoutes } from './routes/dms.js';
import { callRoutes } from './routes/calls.js';
import { reportRoutes } from './routes/reports.js';
import { sectionRoutes } from './routes/sections.js';
import { setupWebSocket } from './ws.js';
import { sql } from 'kysely';

function startCleanupJob(db: ReturnType<typeof createDb>) {
  setInterval(async () => {
    try {
      const [result] = await db.deleteFrom('users')
        .where('email_verified', '=', false)
        .where('created_at', '<', sql<Date>`now() - interval '24 hours'`)
        .execute();
      const count = Number(result.numDeletedRows);
      if (count > 0) console.log(`Cleaned up ${count} unverified accounts`);
    } catch (err) {
      console.error('Cleanup job failed:', err);
    }
  }, 60 * 60 * 1000);
}

async function main() {
  const app = Fastify({ logger: true });

  await app.register(fastifyCors, {
    origin: config.webUrl,
    credentials: true,
  });
  await app.register(fastifyCookie);
  await app.register(fastifyWebsocket);

  const db = createDb(config.databaseUrl);
  const redis = createRedis();
  const redisSub = createRedisSub();
  const minio = createMinioClient();

  await redis.connect();
  await redisSub.connect();

  try {
    await ensureBucket(minio, config.minioBucket);
  } catch (err) {
    app.log.warn('Minio not available, file uploads will fail: %s', (err as Error).message);
  }

  app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  authRoutes(app, db);
  clubRoutes(app, db, redis);
  channelRoutes(app, db, redis);
  sectionRoutes(app, db, redis);
  messageRoutes(app, db, redis);
  memberRoutes(app, db, redis);
  roleRoutes(app, db);
  inviteRoutes(app, db, redis);
  attachmentRoutes(app, db);
  voiceRoutes(app, db);
  auditRoutes(app, db);
  userRoutes(app, db);
  friendRoutes(app, db, redis);
  dmRoutes(app, db, redis);
  callRoutes(app, db, redis);
  reportRoutes(app, db);

  setupWebSocket(app, db, redis, redisSub);

  startCleanupJob(db);

  await app.listen({ port: config.port, host: config.host });
  app.log.info(`API server running on ${config.host}:${config.port}`);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
