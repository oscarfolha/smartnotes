import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../services/tags.service';

const TAGS_KEY = 'tags';

export function useTags() {
  return useQuery({ queryKey: [TAGS_KEY], queryFn: () => tagsApi.getAll() });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => tagsApi.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TAGS_KEY] }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [TAGS_KEY] }),
  });
}
