import webpush from 'web-push';
import type { Kysely } from 'kysely';
import type Redis from 'ioredis';
import type { ApiMessage, ApiDmMessage } from '@wazup/shared';
import type { Database } from './db/database.js';
import { config } from './config.js';

let enabled = false;

export function initPush() {
  if (!config.vapidPublicKey || !config.vapidPrivateKey) {
    console.log('Web Push disabled (no VAPID keys configured)');
    return;
  }
  webpush.setVapidDetails(config.vapidSubject, config.vapidPublicKey, config.vapidPrivateKey);
  enabled = true;
  console.log('Web Push enabled');
}

export function pushEnabled() {
  return enabled;
}

interface PushPayload {
  type: string;
  title: string;
  body: string;
  tag: string;
  url: string;
}

function preview(content: string) {
  const t = (content || '').replace(/\s+/g, ' ').trim();
  if (!t) return 'New message';
  return t.length > 140 ? `${t.slice(0, 139)}…` : t;
}

async function filterActiveConversation(redis: Redis, userIds: string[], convId: string) {
  if (!userIds.length) return userIds;
  const pipe = redis.pipeline();
  for (const id of userIds) pipe.get(`fg:${id}`);
  const res = await pipe.exec();
  if (!res) return userIds;
  return userIds.filter((_, i) => !(res[i] && res[i][1] === convId));
}

async function filterMuted(
  db: Kysely<Database>,
  userIds: string[],
  scopes: [string, string][],
) {
  if (!userIds.length) return userIds;
  const rows = await db
    .selectFrom('notification_settings')
    .select('user_id')
    .where('muted', '=', true)
    .where('user_id', 'in', userIds)
    .where((eb) =>
      eb.or(scopes.map(([type, id]) => eb.and([eb('scope_type', '=', type), eb('scope_id', '=', id)]))),
    )
    .execute();
  const muted = new Set(rows.map((r) => r.user_id));
  return userIds.filter((id) => !muted.has(id));
}

async function sendToUsers(
  db: Kysely<Database>,
  userIds: string[],
  payload: PushPayload,
  urgency: 'normal' | 'high',
) {
  if (!enabled || !userIds.length) return;
  const subs = await db
    .selectFrom('push_subscriptions')
    .selectAll()
    .where('user_id', 'in', userIds)
    .execute();
  if (!subs.length) return;
  const data = JSON.stringify(payload);
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          data,
          { TTL: 172800, urgency },
        );
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) {
          await db.deleteFrom('push_subscriptions').where('id', '=', sub.id).execute().catch(() => {});
        } else {
          await db
            .updateTable('push_subscriptions')
            .set({ failure_count: sub.failure_count + 1 })
            .where('id', '=', sub.id)
            .execute()
            .catch(() => {});
        }
      }
    }),
  );
}

export async function sendPushForChannelMessage(
  db: Kysely<Database>,
  redis: Redis,
  msg: ApiMessage,
  clubId: string,
) {
  if (!enabled) return;
  try {
    const members = await db
      .selectFrom('memberships')
      .select('user_id')
      .where('club_id', '=', clubId)
      .execute();
    let recipients = members.map((m) => m.user_id).filter((id) => id !== msg.author.id);
    recipients = await filterActiveConversation(redis, recipients, `channel:${msg.channel_id}`);
    if (!recipients.length) return;
    recipients = await filterMuted(db, recipients, [
      ['channel', msg.channel_id],
      ['club', clubId],
    ]);
    if (!recipients.length) return;

    const meta = await db
      .selectFrom('channels')
      .innerJoin('clubs', 'clubs.id', 'channels.club_id')
      .select(['channels.name as channel_name', 'clubs.name as club_name', 'clubs.slug as club_slug'])
      .where('channels.id', '=', msg.channel_id)
      .executeTakeFirst();
    const channelName = meta?.channel_name ?? 'channel';
    const clubName = meta?.club_name ?? '';
    const slug = meta?.club_slug ?? clubId;

    await sendToUsers(
      db,
      recipients,
      {
        type: 'channel',
        title: `${msg.author.name} · #${channelName}${clubName ? ` · ${clubName}` : ''}`,
        body: preview(msg.content),
        tag: `channel:${msg.channel_id}`,
        url: `/club/${slug}/channel/${msg.channel_id}`,
      },
      'normal',
    );
  } catch (err) {
    console.error('sendPushForChannelMessage failed:', err);
  }
}

export async function sendPushForDmMessage(
  db: Kysely<Database>,
  redis: Redis,
  msg: ApiDmMessage,
) {
  if (!enabled) return;
  try {
    const members = await db
      .selectFrom('dm_members')
      .select('user_id')
      .where('dm_channel_id', '=', msg.dm_channel_id)
      .execute();
    let recipients = members.map((m) => m.user_id).filter((id) => id !== msg.author.id);
    recipients = await filterActiveConversation(redis, recipients, `dm:${msg.dm_channel_id}`);
    if (!recipients.length) return;
    recipients = await filterMuted(db, recipients, [['dm', msg.dm_channel_id]]);
    if (!recipients.length) return;

    await sendToUsers(
      db,
      recipients,
      {
        type: 'dm',
        title: msg.author.name,
        body: preview(msg.content),
        tag: `dm:${msg.dm_channel_id}`,
        url: `/dm/${msg.dm_channel_id}`,
      },
      'high',
    );
  } catch (err) {
    console.error('sendPushForDmMessage failed:', err);
  }
}
