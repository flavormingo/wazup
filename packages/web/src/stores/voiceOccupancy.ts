import { create } from 'zustand';

interface VoiceOccupancyState {
  occupancy: Record<string, string[]>;
  setPresence: (channelId: string, userId: string, joined: boolean) => void;
  setChannelOccupancy: (map: Record<string, string[]>) => void;
}

export const useVoiceOccupancyStore = create<VoiceOccupancyState>((set) => ({
  occupancy: {},

  setPresence: (channelId, userId, joined) =>
    set((s) => {
      const current = s.occupancy[channelId] || [];
      if (joined) {
        if (current.includes(userId)) return s;
        return { occupancy: { ...s.occupancy, [channelId]: [...current, userId] } };
      }
      if (!current.includes(userId)) return s;
      return { occupancy: { ...s.occupancy, [channelId]: current.filter((id) => id !== userId) } };
    }),

  setChannelOccupancy: (map) =>
    set((s) => ({ occupancy: { ...s.occupancy, ...map } })),
}));
