import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { remindersApi } from '../services/reminders.service';
import { useRemindersStore } from '../store/reminders.store';

const REMINDERS_KEY = 'reminders';

export function usePendingReminders() {
  const { setPendingReminders } = useRemindersStore();

  const query = useQuery({
    queryKey: [REMINDERS_KEY, 'pending'],
    queryFn: () => remindersApi.getPending(),
    refetchInterval: 60_000, // poll every 60s
  });

  useEffect(() => {
    if (query.data) {
      setPendingReminders(query.data);
    }
  }, [query.data, setPendingReminders]);

  return query;
}

export function useMarkReminderDone() {
  const qc = useQueryClient();
  const { dismissReminder, clearDismissedReminder } = useRemindersStore();
  return useMutation({
    mutationFn: (id: string) => remindersApi.markDone(id),
    onSuccess: (_, id) => {
      dismissReminder(id);
      clearDismissedReminder(id);
      qc.invalidateQueries({ queryKey: [REMINDERS_KEY] });
    },
  });
}

export function useSnoozeReminder() {
  const qc = useQueryClient();
  const { dismissReminder } = useRemindersStore();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { minutes?: number; hours?: number; days?: number } }) =>
      remindersApi.snooze(id, body),
    onSuccess: (_, { id }) => {
      dismissReminder(id);
      qc.invalidateQueries({ queryKey: [REMINDERS_KEY] });
    },
  });
}
