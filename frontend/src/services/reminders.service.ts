import api from './api';
import type { Reminder } from '../types';

export const remindersApi = {
  getAll: () => api.get<Reminder[]>('/reminders').then((r) => r.data),

  getPending: () => api.get<Reminder[]>('/reminders/pending').then((r) => r.data),

  markDone: (id: string) => api.patch<Reminder>(`/reminders/${id}/done`).then((r) => r.data),

  snooze: (id: string, body: { minutes?: number; hours?: number; days?: number }) =>
    api.patch<Reminder>(`/reminders/${id}/snooze`, body).then((r) => r.data),
};
