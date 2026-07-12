import { create } from 'zustand';
import { api } from '../lib/api';

interface SectionsState {
  sections: Record<string, any[]>;
  fetchSections: (clubId: string) => Promise<void>;
  addSection: (section: any) => void;
  updateSection: (section: any) => void;
  removeSection: (id: string, clubId: string) => void;
}

export const useSectionsStore = create<SectionsState>((set) => ({
  sections: {},

  fetchSections: async (clubId) => {
    try {
      const sections = await api.getSections(clubId);
      set((s) => ({
        sections: { ...s.sections, [clubId]: sections },
      }));
    } catch {}
  },

  addSection: (section) => {
    set((s) => {
      const list = s.sections[section.club_id] || [];
      if (list.some((sec: any) => sec.id === section.id)) return s;
      return {
        sections: { ...s.sections, [section.club_id]: [...list, section] },
      };
    });
  },

  updateSection: (section) => {
    set((s) => {
      const list = s.sections[section.club_id] || [];
      return {
        sections: {
          ...s.sections,
          [section.club_id]: list.map((sec: any) => (sec.id === section.id ? section : sec)),
        },
      };
    });
  },

  removeSection: (id, clubId) => {
    set((s) => ({
      sections: {
        ...s.sections,
        [clubId]: (s.sections[clubId] || []).filter((sec: any) => sec.id !== id),
      },
    }));
  },
}));
