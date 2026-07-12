import { create } from 'zustand';

type ModalType = 'profile' | 'settings' | 'friends' | 'create-profile' | 'club-members' | 'edit-club' | 'create-channel' | 'create-section' | null;

interface ModalState {
  active: ModalType;
  profileUserId: string | null;
  modalClubId: string | null;
  modalChannelType: 'text' | 'voice' | null;
  modalSectionId: string | null;
  openProfile: (userId?: string) => void;
  openSettings: () => void;
  openFriends: () => void;
  openCreateProfile: () => void;
  openClubMembers: (clubId: string) => void;
  openEditClub: (clubId: string) => void;
  openCreateChannel: (clubId: string, type?: 'text' | 'voice', sectionId?: string) => void;
  openCreateSection: (clubId: string) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  active: null,
  profileUserId: null,
  modalClubId: null,
  modalChannelType: null,
  modalSectionId: null,
  openProfile: (userId) => set({ active: 'profile', profileUserId: userId ?? null }),
  openSettings: () => set({ active: 'settings', profileUserId: null }),
  openFriends: () => set({ active: 'friends', profileUserId: null }),
  openCreateProfile: () => set({ active: 'create-profile', profileUserId: null }),
  openClubMembers: (clubId) => set({ active: 'club-members', modalClubId: clubId }),
  openEditClub: (clubId) => set({ active: 'edit-club', modalClubId: clubId }),
  openCreateChannel: (clubId, type, sectionId) => set({ active: 'create-channel', modalClubId: clubId, modalChannelType: type ?? null, modalSectionId: sectionId ?? null }),
  openCreateSection: (clubId) => set({ active: 'create-section', modalClubId: clubId }),
  close: () => set({ active: null, profileUserId: null, modalClubId: null, modalChannelType: null, modalSectionId: null }),
}));
