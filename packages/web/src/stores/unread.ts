import { create } from 'zustand';
import { api } from '../lib/api';

const DEBOUNCE_MS = 1000;
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

interface UnreadState {
  channelLastRead: Record<string, string>;
  channelLastMessage: Record<string, string>;
  dmLastRead: Record<string, string>;
  dmLastMessage: Record<string, string>;
  channelClubMap: Record<string, string>;

  hydrateChannels: (clubId: string, channels: any[]) => void;
  hydrateDms: (channels: any[]) => void;
  setChannelLastMessage: (channelId: string, timestamp: string) => void;
  setDmLastMessage: (dmChannelId: string, timestamp: string) => void;
  markChannelRead: (channelId: string) => void;
  markDmRead: (dmChannelId: string) => void;
  addChannelMapping: (channelId: string, clubId: string) => void;
  removeChannelMapping: (channelId: string) => void;
}

export const useUnreadStore = create<UnreadState>((set) => ({
  channelLastRead: {},
  channelLastMessage: {},
  dmLastRead: {},
  dmLastMessage: {},
  channelClubMap: {},

  hydrateChannels: (clubId, channels) => {
    set((s) => {
      const clr = { ...s.channelLastRead };
      const clm = { ...s.channelLastMessage };
      const ccm = { ...s.channelClubMap };
      for (const ch of channels) {
        if (ch.last_read_at && (!clr[ch.id] || ch.last_read_at > clr[ch.id])) clr[ch.id] = ch.last_read_at;
        if (ch.last_message_at && (!clm[ch.id] || ch.last_message_at > clm[ch.id])) clm[ch.id] = ch.last_message_at;
        ccm[ch.id] = clubId;
      }
      return { channelLastRead: clr, channelLastMessage: clm, channelClubMap: ccm };
    });
  },

  hydrateDms: (channels) => {
    set((s) => {
      const dlr = { ...s.dmLastRead };
      const dlm = { ...s.dmLastMessage };
      for (const ch of channels) {
        if (ch.last_read_at && (!dlr[ch.id] || ch.last_read_at > dlr[ch.id])) dlr[ch.id] = ch.last_read_at;
        if (ch.updated_at && (!dlm[ch.id] || ch.updated_at > dlm[ch.id])) dlm[ch.id] = ch.updated_at;
      }
      return { dmLastRead: dlr, dmLastMessage: dlm };
    });
  },

  setChannelLastMessage: (channelId, timestamp) => {
    set((s) => ({
      channelLastMessage: { ...s.channelLastMessage, [channelId]: timestamp },
    }));
  },

  setDmLastMessage: (dmChannelId, timestamp) => {
    set((s) => ({
      dmLastMessage: { ...s.dmLastMessage, [dmChannelId]: timestamp },
    }));
  },

  markChannelRead: (channelId) => {
    set((s) => {
      const now = new Date().toISOString();
      const lastMsg = s.channelLastMessage[channelId];
      const ts = lastMsg && lastMsg > now ? lastMsg : now;
      return { channelLastRead: { ...s.channelLastRead, [channelId]: ts } };
    });
    clearTimeout(debounceTimers[`ch:${channelId}`]);
    debounceTimers[`ch:${channelId}`] = setTimeout(() => {
      api.markChannelRead(channelId).catch(() => {});
    }, DEBOUNCE_MS);
  },

  markDmRead: (dmChannelId) => {
    set((s) => {
      const now = new Date().toISOString();
      const lastMsg = s.dmLastMessage[dmChannelId];
      const ts = lastMsg && lastMsg > now ? lastMsg : now;
      return { dmLastRead: { ...s.dmLastRead, [dmChannelId]: ts } };
    });
    clearTimeout(debounceTimers[`dm:${dmChannelId}`]);
    debounceTimers[`dm:${dmChannelId}`] = setTimeout(() => {
      api.markDmRead(dmChannelId).catch(() => {});
    }, DEBOUNCE_MS);
  },

  addChannelMapping: (channelId, clubId) => {
    set((s) => ({
      channelClubMap: { ...s.channelClubMap, [channelId]: clubId },
    }));
  },

  removeChannelMapping: (channelId) => {
    set((s) => {
      const next = { ...s.channelClubMap };
      delete next[channelId];
      return { channelClubMap: next };
    });
  },
}));

export function isChannelUnread(channelId: string): boolean {
  const s = useUnreadStore.getState();
  const lastMsg = s.channelLastMessage[channelId];
  const lastRead = s.channelLastRead[channelId];
  if (!lastMsg) return false;
  if (!lastRead) return true;
  return lastMsg > lastRead;
}

export function isDmUnread(dmChannelId: string): boolean {
  const s = useUnreadStore.getState();
  const lastMsg = s.dmLastMessage[dmChannelId];
  const lastRead = s.dmLastRead[dmChannelId];
  if (!lastMsg) return false;
  if (!lastRead) return true;
  return lastMsg > lastRead;
}

export function hasClubUnread(clubId: string): boolean {
  const s = useUnreadStore.getState();
  for (const [channelId, cid] of Object.entries(s.channelClubMap)) {
    if (cid === clubId && isChannelUnread(channelId)) return true;
  }
  return false;
}

export function getUnreadDmCount(): number {
  const s = useUnreadStore.getState();
  let count = 0;
  for (const dmId of Object.keys(s.dmLastMessage)) {
    if (isDmUnread(dmId)) count++;
  }
  return count;
}

export function getTotalUnreadCount(): number {
  const s = useUnreadStore.getState();
  let count = 0;
  for (const chId of Object.keys(s.channelLastMessage)) {
    if (isChannelUnread(chId)) count++;
  }
  count += getUnreadDmCount();
  return count;
}
