import { create } from 'zustand';
import { api } from '../lib/api';
import { authClient } from '../lib/authClient';
import { disablePush } from '../lib/push';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const user = await api.getMe();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  updateProfile: async (data: any) => {
    const updated = await api.updateProfile(data);
    set((s) => ({ user: s.user ? { ...s.user, ...updated } : s.user }));
  },

  logout: async () => {
    try {
      await disablePush();
    } catch {
    }
    try {
      await authClient.signOut();
    } catch {
    }
    set({ user: null });
  },
}));
