import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReminderPopup } from './ReminderPopup';
import { AppPreferencesProvider } from '../../contexts/appPreferences';

const dismissReminder = vi.fn();
const dismissReminders = vi.fn();

vi.mock('../../store/reminders.store', () => ({
  useRemindersStore: () => ({
    activeReminder: { id: 'r1', noteId: 'n1', note: { title: 'A', content: 'B' } },
    pendingReminders: [
      { id: 'r1', noteId: 'n1', note: { title: 'A', content: 'B' } },
      { id: 'r2', noteId: 'n2', note: { title: 'C', content: 'D' } },
    ],
    dismissReminder,
    dismissReminders,
  }),
}));

vi.mock('../../hooks/useReminders', () => ({
  useMarkReminderDone: () => ({ mutate: vi.fn() }),
}));

vi.mock('../../store/notes.store', () => ({
  useNotesStore: () => ({ openModal: vi.fn() }),
}));

describe('ReminderPopup digest', () => {
  it('shows grouped reminder count', () => {
    dismissReminder.mockReset();
    dismissReminders.mockReset();

    render(
      <AppPreferencesProvider>
        <ReminderPopup />
      </AppPreferencesProvider>
    );

    expect(screen.getByText('Reminder (2)')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    const dismissButtons = screen.getAllByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButtons[dismissButtons.length - 1]);

    expect(dismissReminders).toHaveBeenCalledWith(['r1', 'r2']);
  });
});
