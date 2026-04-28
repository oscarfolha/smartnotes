import { create } from 'zustand';
import type { NoteFilters } from '../types';

interface NotesStoreState {
  filters: NoteFilters;
  setFilters: (filters: Partial<NoteFilters>) => void;
  clearFilters: () => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  isModalOpen: boolean;
  initialDate: string | null;
  openModal: (options?: { noteId?: string; initialDate?: string }) => void;
  closeModal: () => void;
}

export const useNotesStore = create<NotesStoreState>((set) => ({
  filters: {},
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),

  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  isModalOpen: false,
  initialDate: null,
  openModal: (options) =>
    set({
      isModalOpen: true,
      selectedNoteId: options?.noteId ?? null,
      initialDate: options?.initialDate ?? null,
    }),
  closeModal: () => set({ isModalOpen: false, selectedNoteId: null, initialDate: null }),
}));
