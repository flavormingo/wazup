import { create } from 'zustand';
import { api } from '../lib/api';

interface MembersState {
  members: Record<string, any[]>;
  loading: boolean;
  fetchMembers: (clubId: string) => Promise<void>;
  addMember: (clubId: string, member: any) => void;
  removeMember: (clubId: string, userId: string) => void;
}

export const useMembersStore = create<MembersState>((set) => ({
  members: {},
  loading: false,

  fetchMembers: async (clubId) => {
    set({ loading: true });
    try {
      const members = await api.getMembers(clubId);
      set((s) => ({
        members: { ...s.members, [clubId]: members },
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  addMember: (clubId, member) => {
    set((s) => {
      const list = s.members[clubId] || [];
      if (list.some((m: any) => m.user.id === member.user.id)) return s;
      return { members: { ...s.members, [clubId]: [...list, member] } };
    });
  },

  removeMember: (clubId, userId) => {
    set((s) => ({
      members: {
        ...s.members,
        [clubId]: (s.members[clubId] || []).filter((m: any) => m.user.id !== userId),
      },
    }));
  },
}));
