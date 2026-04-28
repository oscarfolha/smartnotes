import { usePendingReminders } from '../../hooks/useReminders';

/** Invisible component that fetches pending reminders on mount and polls. */
export function PendingRemindersLoader() {
  usePendingReminders();
  return null;
}
