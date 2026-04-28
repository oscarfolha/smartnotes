import api from './api';
import type { Tag } from '../types';

export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags').then((r) => r.data),

  create: (name: string) => api.post<Tag>('/tags', { name }).then((r) => r.data),

  delete: (id: string) => api.delete(`/tags/${id}`),
};
