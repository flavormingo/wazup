import { create } from 'zustand';
import { api } from '../lib/api';
import { useUnreadStore } from './unread';

interface ChannelsState {
  channels: Record<string, any[]>;
  currentChannelId: string | null;
  loading: boolean;
  fetchChannels: (clubId: string) => Promise<void>;
  setCurrentChannel: (id: string | null) => void;
  addChannel: (channel: any) => void;
  updateChannel: (channel: any) => void;
  removeChannel: (id: string, clubId: string) => void;
  clearSectionId: (sectionId: string, clubId: string) => void;
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  channels: {},
  currentChannelId: null,
  loading: false,

  fetchChannels: async (clubId) => {
    set({ loading: true });
    try {
      const channels = await api.getChannels(clubId);
      useUnreadStore.getState().hydrateChannels(clubId, channels);
      set((s) => ({
        channels: { ...s.channels, [clubId]: channels },
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  setCurrentChannel: (id) => set({ currentChannelId: id }),

  addChannel: (channel) => {
    set((s) => {
      const list = s.channels[channel.club_id] || [];
      if (list.some((c: any) => c.id === channel.id)) return s;
      return {
        channels: { ...s.channels, [channel.club_id]: [...list, channel] },
      };
    });
  },

  updateChannel: (channel) => {
    set((s) => {
      const list = s.channels[channel.club_id] || [];
      return {
        channels: {
          ...s.channels,
          [channel.club_id]: list.map((c: any) => (c.id === channel.id ? channel : c)),
        },
      };
    });
  },

  removeChannel: (id, clubId) => {
    set((s) => {
      const next: Record<string, unknown> = {
        channels: {
          ...s.channels,
          [clubId]: (s.channels[clubId] || []).filter((c: any) => c.id !== id),
        },
      };
      if (s.currentChannelId === id) {
        next.currentChannelId = null;
      }
      return next as any;
    });
  },

  clearSectionId: (sectionId, clubId) => {
    set((s) => {
      const list = s.channels[clubId] || [];
      return {
        channels: {
          ...s.channels,
          [clubId]: list.map((c: any) => c.section_id === sectionId ? { ...c, section_id: null } : c),
        },
      };
    });
  },
}));
