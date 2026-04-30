import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../services/notes.service';
import { useNotesStore } from '../store/notes.store';
import type { CreateNoteDto, UpdateNoteDto } from '../types';

export const NOTES_KEY = 'notes';
export const NOTE_PRESETS_KEY = 'notePresets';

export function useNotes() {
  const { filters } = useNotesStore();
  return useQuery({
    queryKey: [NOTES_KEY, filters],
    queryFn: () => notesApi.getAll(filters),
  });
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: [NOTES_KEY, id],
    queryFn: () => notesApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteDto) => notesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      qc.invalidateQueries({ queryKey: ['archivedNotes'] });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteDto }) =>
      notesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      qc.invalidateQueries({ queryKey: ['archivedNotes'] });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      qc.invalidateQueries({ queryKey: ['archivedNotes'] });
    },
  });
}

export function useReorderNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteIds: string[]) => notesApi.reorder(noteIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTES_KEY] }),
  });
}

export function useArchiveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.archive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      qc.invalidateQueries({ queryKey: ['archivedNotes'] });
    },
  });
}

export function useUnarchiveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.unarchive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      qc.invalidateQueries({ queryKey: ['archivedNotes'] });
    },
  });
}

export function useArchivedNotes() {
  return useQuery({
    queryKey: ['archivedNotes'],
    queryFn: () => notesApi.getArchived(),
  });
}

export function useNotePresets() {
  return useQuery({
    queryKey: [NOTE_PRESETS_KEY],
    queryFn: () => notesApi.getPresets(),
  });
}

export function useCreateNotePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof notesApi.createPreset>[0]) => notesApi.createPreset(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTE_PRESETS_KEY] }),
  });
}

export function useDeleteNotePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.deletePreset(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTE_PRESETS_KEY] }),
  });
}
