import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import { useRemindersStore } from '../../store/reminders.store';
import { useMarkReminderDone } from '../../hooks/useReminders';
import { useNotesStore } from '../../store/notes.store';
import { useAppPreferences } from '../../contexts/appPreferences';
import './ReminderPopup.css';

export function ReminderPopup() {
  const { activeReminder, pendingReminders, dismissReminder, dismissReminders } = useRemindersStore();
  const markDone = useMarkReminderDone();
  const { openModal } = useNotesStore();
  const { t } = useAppPreferences();

  if (!activeReminder) return null;
  const remindersToShow = pendingReminders.slice(0, 5);

  return (
    <Dialog open fullWidth maxWidth="sm">
      <DialogTitle>{t('reminder')} ({pendingReminders.length})</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {remindersToShow.map((reminder) => (
            <Stack key={reminder.id} spacing={0.5} className="reminder-popup-item">
              <Typography variant="h6">{reminder.note?.title}</Typography>
              <Typography variant="body2" color="text.secondary">{reminder.note?.content}</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => dismissReminder(reminder.id)}>{t('dismiss')}</Button>
                <Button size="small" onClick={() => openModal({ noteId: reminder.noteId })}>{t('openNote')}</Button>
                <Button size="small" variant="contained" color="success" onClick={() => markDone.mutate(reminder.id)}>
                  {t('markDone')}
                </Button>
              </Stack>
            </Stack>
          ))}
          {pendingReminders.length > remindersToShow.length && (
            <Typography variant="caption" color="text.secondary">
              +{pendingReminders.length - remindersToShow.length} more
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">{t('reminderHint')}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissReminders(pendingReminders.map((r) => r.id))}>{t('dismiss')}</Button>
      </DialogActions>
    </Dialog>
  );
}
