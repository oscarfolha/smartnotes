import api from './api';
import type { AIQueryResponse } from '../types';

export const aiApi = {
  query: (question: string) =>
    api.post<AIQueryResponse>('/ai/query', { question }).then((r) => r.data),
};
