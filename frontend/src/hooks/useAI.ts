import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../services/ai.service';
import type { AIQueryResponse } from '../types';

export function useAIQuery() {
  const [history, setHistory] = useState<AIQueryResponse[]>([]);

  const mutation = useMutation({
    mutationFn: (question: string) => aiApi.query(question),
    onSuccess: (data) => setHistory((prev) => [...prev, data]),
  });

  return { ...mutation, history, clearHistory: () => setHistory([]) };
}
