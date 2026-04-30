import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { useNotesStore } from '../../store/notes.store';
import { useNote, useCreateNote, useUpdateNote } from '../../hooks/useNotes';
import { TagSelector } from '../tags/TagSelector';
import { useAppPreferences } from '../../contexts/appPreferences';
import type { NoteType, Priority } from '../../types';
import { activityEventLabel, noteTypeLabel, priorityLabel } from '../../utils/i18n';
import './NoteModal.css';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['reminder', 'meeting', 'note', 'idea']),
  date: z.string().min(1, 'Date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  tagIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export function NoteModal() {
  const { isModalOpen, closeModal, selectedNoteId, initialDate } = useNotesStore();
  const { data: existingNote } = useNote(selectedNoteId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const { t, language } = useAppPreferences();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'note',
      priority: 'medium',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      tagIds: [],
    },
  });

  const noteType = watch('type');

  useEffect(() => {
    if (existingNote) {
      reset({
        title: existingNote.title,
        content: existingNote.content,
        type: existingNote.type,
        date: format(new Date(existingNote.date), "yyyy-MM-dd'T'HH:mm"),
        priority: existingNote.priority,
        tagIds: existingNote.noteTags.map((nt) => nt.tagId),
      });
      return;
    }

    if (!selectedNoteId) {
      reset({
        title: '',
        content: '',
        type: 'note',
        priority: 'medium',
        date: format(initialDate ? new Date(initialDate) : new Date(), "yyyy-MM-dd'T'HH:mm"),
        tagIds: [],
      });
    }
  }, [existingNote, selectedNoteId, initialDate, reset]);

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      date: new Date(data.date).toISOString(),
    };

    if (selectedNoteId) {
      await updateNote.mutateAsync({ id: selectedNoteId, data: payload });
    } else {
      await createNote.mutateAsync(payload);
    }
    closeModal();
  }

  let submitLabel = t('create');
  if (selectedNoteId) {
    submitLabel = t('update');
  }
  if (isSubmitting) {
    submitLabel = t('saving');
  }

  return (
    <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle>{selectedNoteId ? t('editNote') : t('newNote')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} className="note-modal-stack">
          <TextField
            label={t('title')}
            fullWidth
            variant="outlined"
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!errors.type} margin="normal">
                <InputLabel id="note-type-label">{t('type')}</InputLabel>
                <Select
                  labelId="note-type-label"
                  label={t('type')}
                  value={watch('type')}
                  onChange={(e) => setValue('type', e.target.value as NoteType)}
                >
                  {(['note', 'reminder', 'meeting', 'idea'] as NoteType[]).map((noteTypeOption) => (
                    <MenuItem key={noteTypeOption} value={noteTypeOption}>
                      {noteTypeLabel(noteTypeOption, t)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type?.message && <FormHelperText>{errors.type.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {noteType !== 'reminder' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.priority} margin="normal">
                  <InputLabel id="note-priority-label">{t('priority')}</InputLabel>
                  <Select
                    labelId="note-priority-label"
                    label={t('priority')}
                    value={watch('priority')}
                    onChange={(e) => setValue('priority', e.target.value as Priority)}
                  >
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <MenuItem key={p} value={p}>
                        {priorityLabel(p, t)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority?.message && <FormHelperText>{errors.priority.message}</FormHelperText>}
                </FormControl>
              </Grid>
            )}
          </Grid>

          {noteType !== 'reminder' && (
            <TextField
              label={t('date')}
              type="datetime-local"
              fullWidth
              variant="outlined"
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}

          {noteType === 'reminder' && (
            <Typography variant="body2" color="text.secondary" className="note-modal-reminder-hint">
              {t('reminderPersistentHint')}
            </Typography>
          )}

          <TextField
            label={t('content')}
            fullWidth
            multiline
            minRows={5}
            variant="outlined"
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
          />

          <TagSelector
            selectedIds={(watch('tagIds') as string[]) ?? []}
            onChange={(ids) => setValue('tagIds', ids)}
          />

          {selectedNoteId && Array.isArray(existingNote?.metadata?.activity) && existingNote.metadata.activity.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle2">{t('activityTimeline')}</Typography>
              <Stack spacing={0.5} className="note-modal-activity">
                {existingNote.metadata.activity.slice().reverse().map((entry, idx) => (
                  <Typography key={`${entry.at}-${idx}`} variant="caption" color="text.secondary">
                    {activityEventLabel(entry.event, t)} - {new Date(entry.at).toLocaleString(language)}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>{t('cancel')}</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
