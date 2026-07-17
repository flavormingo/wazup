import { create } from 'zustand';
import { api } from '../lib/api';

type Scope = 'club' | 'channel' | 'dm';

const key = (t: string, id: string) => `${t}:${id}`;

interface MutesState {
  muted: Set<string>;
  loaded: boolean;
  fetchMutes: () => Promise<void>;
  toggle: (scopeType: Scope, scopeId: string) => Promise<void>;
}

export const useMutesStore = create<MutesState>((set, get) => ({
  muted: new Set(),
  loaded: false,

  fetchMutes: async () => {
    try {
      const rows = await api.getMutes();
      set({ muted: new Set(rows.map((r) => key(r.scope_type, r.scope_id))), loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (scopeType, scopeId) => {
    const k = key(scopeType, scopeId);
    const has = get().muted.has(k);
    set((s) => {
      const next = new Set(s.muted);
      if (has) next.delete(k);
      else next.add(k);
      return { muted: next };
    });
    try {
      if (has) await api.unmute(scopeType, scopeId);
      else await api.mute(scopeType, scopeId);
    } catch {
      set((s) => {
        const next = new Set(s.muted);
        if (has) next.add(k);
        else next.delete(k);
        return { muted: next };
      });
    }
  },
}));

export function isScopeMuted(scopeType: Scope, scopeId: string): boolean {
  return useMutesStore.getState().muted.has(key(scopeType, scopeId));
}
