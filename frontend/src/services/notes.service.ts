import api from './api';
import type { Note, CreateNoteDto, UpdateNoteDto, NoteFilters, NoteFilterPreset } from '../types';

export const notesApi = {
  getAll: (filters?: NoteFilters) =>
    api.get<Note[]>('/notes', { params: filters }).then((r) => r.data),

  getById: (id: string) => api.get<Note>(`/notes/${id}`).then((r) => r.data),

  create: (data: CreateNoteDto) => api.post<Note>('/notes', data).then((r) => r.data),

  update: (id: string, data: UpdateNoteDto) =>
    api.patch<Note>(`/notes/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/notes/${id}`),

  reorder: (noteIds: string[]) =>
    api.post<Note[]>('/notes/reorder', { noteIds }).then((r) => r.data),

  archive: (id: string) =>
    api.patch<Note>(`/notes/${id}/archive`).then((r) => r.data),

  unarchive: (id: string) =>
    api.patch<Note>(`/notes/${id}/unarchive`).then((r) => r.data),

  getArchived: () =>
    api.get<Note[]>('/notes/archived').then((r) => r.data),

  getPresets: () =>
    api.get<NoteFilterPreset[]>('/notes/presets').then((r) => r.data),

  createPreset: (data: Pick<NoteFilterPreset, 'name' | 'search' | 'type' | 'priority' | 'tagId'>) =>
    api.post<NoteFilterPreset>('/notes/presets', data).then((r) => r.data),

  deletePreset: (id: string) =>
    api.delete(`/notes/presets/${id}`),
};
