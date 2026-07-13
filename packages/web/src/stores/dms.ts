import { create } from 'zustand';
import { api } from '../lib/api';
import { useUnreadStore } from './unread';

interface DmsState {
  channels: any[];
  messages: Record<string, any[]>;
  currentDmId: string | null;
  loading: boolean;
  hasMore: Record<string, boolean>;
  loadingOlder: boolean;
  fetchDmChannels: () => Promise<void>;
  createDm: (userIds: string[]) => Promise<any>;
  setCurrentDm: (id: string | null) => void;
  fetchDmMessages: (dmChannelId: string) => Promise<void>;
  fetchOlderDmMessages: (dmChannelId: string) => Promise<void>;
  addDmMessage: (message: any) => void;
  updateDmMessage: (message: any) => void;
  removeDmMessage: (id: string, dmChannelId: string) => void;
  applyDmReaction: (dmChannelId: string, messageId: string, emoji: string, isMe: boolean, add: boolean) => void;
  addDmChannel: (channel: any) => void;
  removeDmChannelByUserId: (userId: string) => void;
}

export const useDmsStore = create<DmsState>((set, get) => ({
  channels: [],
  messages: {},
  currentDmId: null,
  loading: false,
  loadingOlder: false,
  hasMore: {},

  fetchDmChannels: async () => {
    try {
      const channels = await api.getDmChannels();
      useUnreadStore.getState().hydrateDms(channels);
      set({ channels });
    } catch {
    }
  },

  createDm: async (userIds: string[]) => {
    const channel = await api.createDm(userIds);
    set((s) => {
      if (s.channels.some((c: any) => c.id === channel.id)) return s;
      return { channels: [channel, ...s.channels] };
    });
    return channel;
  },

  setCurrentDm: (id) => set({ currentDmId: id }),

  fetchDmMessages: async (dmChannelId: string) => {
    set({ loading: true });
    try {
      const messages = await api.getDmMessages(dmChannelId);
      set((s) => ({
        messages: { ...s.messages, [dmChannelId]: messages },
        hasMore: { ...s.hasMore, [dmChannelId]: messages.length >= 50 },
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  fetchOlderDmMessages: async (dmChannelId: string) => {
    if (get().loadingOlder) return;
    const existing = get().messages[dmChannelId];
    if (!existing?.length) return;
    const oldest = existing[0];
    set({ loadingOlder: true });
    try {
      const older = await api.getDmMessages(dmChannelId, oldest.created_at);
      set((s) => ({
        messages: { ...s.messages, [dmChannelId]: [...older, ...(s.messages[dmChannelId] || [])] },
        hasMore: { ...s.hasMore, [dmChannelId]: older.length >= 50 },
        loadingOlder: false,
      }));
    } catch {
      set({ loadingOlder: false });
    }
  },

  addDmMessage: (message) => {
    set((s) => {
      const list = s.messages[message.dm_channel_id] || [];
      if (list.some((m: any) => m.id === message.id)) return s;

      const channels = s.channels.map((c: any) =>
        c.id === message.dm_channel_id
          ? { ...c, last_message: message, updated_at: message.created_at }
          : c,
      );
      channels.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      return {
        messages: { ...s.messages, [message.dm_channel_id]: [...list, message] },
        channels,
      };
    });
  },

  updateDmMessage: (message) => {
    set((s) => {
      const list = s.messages[message.dm_channel_id] || [];
      return {
        messages: {
          ...s.messages,
          [message.dm_channel_id]: list.map((m: any) =>
            m.id === message.id ? { ...message, reactions: m.reactions ?? message.reactions ?? [] } : m
          ),
        },
      };
    });
  },

  removeDmMessage: (id, dmChannelId) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [dmChannelId]: (s.messages[dmChannelId] || []).filter((m: any) => m.id !== id),
      },
    }));
  },

  applyDmReaction: (dmChannelId, messageId, emoji, isMe, add) => {
    set((s) => {
      const list = s.messages[dmChannelId];
      if (!list) return s;
      return {
        messages: {
          ...s.messages,
          [dmChannelId]: list.map((m: any) => {
            if (m.id !== messageId) return m;
            const reactions = [...(m.reactions || [])];
            const idx = reactions.findIndex((r: any) => r.emoji === emoji);
            if (add) {
              if (idx >= 0) {
                reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1, me: reactions[idx].me || isMe };
              } else {
                reactions.push({ emoji, count: 1, me: isMe });
              }
            } else if (idx >= 0) {
              const count = reactions[idx].count - 1;
              if (count <= 0) {
                reactions.splice(idx, 1);
              } else {
                reactions[idx] = { ...reactions[idx], count, me: isMe ? false : reactions[idx].me };
              }
            }
            return { ...m, reactions };
          }),
        },
      };
    });
  },

  addDmChannel: (channel) => {
    set((s) => {
      if (s.channels.some((c: any) => c.id === channel.id)) return s;
      return { channels: [channel, ...s.channels] };
    });
    useUnreadStore.getState().hydrateDms([channel]);
  },

  removeDmChannelByUserId: (userId) => {
    set((s) => ({
      channels: s.channels.filter((c: any) => {
        if (c.type !== 'direct') return true;
        return !c.members?.some((m: any) => m.id === userId);
      }),
    }));
  },
}));
