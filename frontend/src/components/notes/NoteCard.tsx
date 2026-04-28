import { useState } from 'react';
import type { DragEventHandler } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import type { Note } from '../../types';
import { useNotesStore } from '../../store/notes.store';
import { useDeleteNote, useArchiveNote } from '../../hooks/useNotes';
import { useAppPreferences } from '../../contexts/appPreferences';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDragEnd?: DragEventHandler<HTMLDivElement>;
}

export function NoteCard({ note, draggable, onDragStart, onDragEnd }: Readonly<NoteCardProps>) {
  const { openModal } = useNotesStore();
  const { t } = useAppPreferences();
  const deleteNote = useDeleteNote();
  const archiveNote = useArchiveNote();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'archive' | 'delete' | null>(null);
  const [timerId, setTimerId] = useState<number | null>(null);

  const commitPendingAction = async (action: 'archive' | 'delete') => {
    if (action === 'archive') {
      await archiveNote.mutateAsync(note.id);
    } else {
      await deleteNote.mutateAsync(note.id);
    }
  };

  const scheduleAction = (action: 'archive' | 'delete') => {
    if (timerId) {
      globalThis.clearTimeout(timerId);
    }
    setPendingAction(action);
    setSnackbarOpen(true);
    const id = globalThis.setTimeout(async () => {
      await commitPendingAction(action);
      setSnackbarOpen(false);
      setPendingAction(null);
      setTimerId(null);
    }, 5000);
    setTimerId(id);
  };

  const handleDelete = async () => {
    scheduleAction('delete');
    setConfirmOpen(false);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    scheduleAction('archive');
  };

  const undoPendingAction = () => {
    if (timerId) {
      globalThis.clearTimeout(timerId);
    }
    setSnackbarOpen(false);
    setPendingAction(null);
    setTimerId(null);
  };

  return (
    <>
      <Card
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="note-card"
        onClick={() => openModal({ noteId: note.id })}
      >
        <CardContent>
          <Stack direction="row" spacing={1} className="note-card-header">
            <Typography variant="h6" noWrap>{note.title}</Typography>
            {draggable && <DragIndicatorIcon color="disabled" fontSize="small" />}
          </Stack>

          <Stack direction="row" spacing={1} className="note-card-meta">
            <Chip label={note.type} size="small" color="primary" variant="outlined" />
            <Chip label={note.priority} size="small" color="secondary" variant="outlined" />
          </Stack>

          <Typography variant="body2" color="text.secondary" className="note-card-content">
            {note.summary ?? note.content}
          </Typography>

          <Stack direction="row" spacing={1} className="note-card-tags">
            {note.noteTags?.map(({ tag }) => (
              <Chip key={tag.id} label={`#${tag.name}`} size="small" />
            ))}
          </Stack>
        </CardContent>

        <CardActions className="note-card-actions">
          <Typography variant="caption" color="text.secondary">
            {format(new Date(note.date), 'MMM d, yyyy')}
          </Typography>
          <Stack direction="row" spacing={0}>
            <Tooltip title={t('archive')}>
              <IconButton
                size="small"
                onClick={handleArchive}
                aria-label="Archive note"
              >
                <ArchiveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('delete')}>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                aria-label="Delete note"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>{t('cancel')}</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <Alert
          severity="warning"
          onClose={() => setSnackbarOpen(false)}
          action={<Button color="inherit" size="small" onClick={undoPendingAction}>{t('undo')}</Button>}
        >
          {pendingAction === 'archive' ? t('archivedSuccess') : t('deletedSuccess')}
        </Alert>
      </Snackbar>
    </>
  );
}
