import { create } from 'zustand';
import { api } from '../lib/api';

interface MessagesState {
  messages: Record<string, any[]>;
  loading: boolean;
  loadingOlder: boolean;
  hasMore: Record<string, boolean>;
  fetchMessages: (channelId: string) => Promise<void>;
  fetchOlderMessages: (channelId: string) => Promise<void>;
  addMessage: (message: any) => void;
  updateMessage: (message: any) => void;
  removeMessage: (id: string, channelId: string) => void;
  applyReaction: (channelId: string, messageId: string, emoji: string, isMe: boolean, add: boolean) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: {},
  loading: false,
  loadingOlder: false,
  hasMore: {},

  fetchMessages: async (channelId) => {
    set({ loading: true });
    try {
      const messages = await api.getMessages(channelId);
      set((s) => ({
        messages: { ...s.messages, [channelId]: messages },
        hasMore: { ...s.hasMore, [channelId]: messages.length >= 50 },
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  fetchOlderMessages: async (channelId) => {
    if (get().loadingOlder) return;
    const existing = get().messages[channelId] || [];
    if (!existing.length) return;
    const oldest = existing[0];
    set({ loadingOlder: true });
    try {
      const older = await api.getMessages(channelId, oldest.created_at);
      set((s) => ({
        messages: { ...s.messages, [channelId]: [...older, ...(s.messages[channelId] || [])] },
        hasMore: { ...s.hasMore, [channelId]: older.length >= 50 },
        loadingOlder: false,
      }));
    } catch {
      set({ loadingOlder: false });
    }
  },

  addMessage: (message) => {
    set((s) => {
      const list = s.messages[message.channel_id] || [];
      if (list.some((m: any) => m.id === message.id)) return s;
      return {
        messages: { ...s.messages, [message.channel_id]: [...list, message] },
      };
    });
  },

  updateMessage: (message) => {
    set((s) => {
      const list = s.messages[message.channel_id] || [];
      return {
        messages: {
          ...s.messages,
          [message.channel_id]: list.map((m: any) =>
            m.id === message.id ? { ...message, reactions: m.reactions ?? message.reactions ?? [] } : m
          ),
        },
      };
    });
  },

  removeMessage: (id, channelId) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: (s.messages[channelId] || []).filter((m: any) => m.id !== id),
      },
    }));
  },

  applyReaction: (channelId, messageId, emoji, isMe, add) => {
    set((s) => {
      const list = s.messages[channelId];
      if (!list) return s;
      return {
        messages: {
          ...s.messages,
          [channelId]: list.map((m: any) => {
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
}));
