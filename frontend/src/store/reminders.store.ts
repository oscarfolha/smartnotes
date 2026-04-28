import { create } from 'zustand';
import type { Reminder } from '../types';

interface RemindersStoreState {
  pendingReminders: Reminder[];
  setPendingReminders: (reminders: Reminder[]) => void;
  dismissReminder: (id: string) => void;
  dismissReminders: (ids: string[]) => void;
  clearDismissedReminder: (id: string) => void;
  activeReminder: Reminder | null;
  setActiveReminder: (reminder: Reminder | null) => void;
  dismissedReminderIds: string[];
}

export const useRemindersStore = create<RemindersStoreState>((set) => ({
  pendingReminders: [],
  dismissedReminderIds: [],
  setPendingReminders: (reminders) =>
    set((state) => {
      const visible = reminders.filter((r) => !state.dismissedReminderIds.includes(r.id));
      return { pendingReminders: visible, activeReminder: visible[0] ?? null };
    }),
  dismissReminder: (id) =>
    set((state) => {
      const remaining = state.pendingReminders.filter((r) => r.id !== id);
      const dismissedReminderIds = state.dismissedReminderIds.includes(id)
        ? state.dismissedReminderIds
        : [...state.dismissedReminderIds, id];
      return { pendingReminders: remaining, activeReminder: remaining[0] ?? null, dismissedReminderIds };
    }),
  dismissReminders: (ids) =>
    set((state) => {
      if (ids.length === 0) return state;
      const idSet = new Set(ids);
      const remaining = state.pendingReminders.filter((r) => !idSet.has(r.id));
      const dismissedReminderIds = [
        ...state.dismissedReminderIds,
        ...ids.filter((id) => !state.dismissedReminderIds.includes(id)),
      ];
      return { pendingReminders: remaining, activeReminder: remaining[0] ?? null, dismissedReminderIds };
    }),
  clearDismissedReminder: (id) =>
    set((state) => ({
      dismissedReminderIds: state.dismissedReminderIds.filter((rid) => rid !== id),
    })),
  activeReminder: null,
  setActiveReminder: (reminder) => set({ activeReminder: reminder }),
}));
