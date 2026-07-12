import { create } from 'zustand';

interface CallState {
  incomingCall: { dmChannelId: string; caller: { id: string; username: string; display_name: string; avatar_url: string | null } } | null;
  outgoingCall: { dmChannelId: string } | null;
  activeCallDmChannelId: string | null;
  setIncomingCall: (call: CallState['incomingCall']) => void;
  setOutgoingCall: (call: CallState['outgoingCall']) => void;
  setActiveCall: (dmChannelId: string | null) => void;
  clearAll: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  outgoingCall: null,
  activeCallDmChannelId: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  setOutgoingCall: (call) => set({ outgoingCall: call }),
  setActiveCall: (dmChannelId) => set({ activeCallDmChannelId: dmChannelId }),
  clearAll: () => set({ incomingCall: null, outgoingCall: null, activeCallDmChannelId: null }),
}));
