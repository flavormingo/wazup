import { create } from 'zustand';

interface LightboxState {
  src: string | null;
  alt: string;
  open: (src: string, alt?: string) => void;
  close: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  src: null,
  alt: '',
  open: (src, alt = 'expanded image') => set({ src, alt }),
  close: () => set({ src: null }),
}));

export const openLightbox = (src: string, alt?: string) => useLightboxStore.getState().open(src, alt);
