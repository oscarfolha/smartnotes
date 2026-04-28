import { useMemo, useRef, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { useArchivedNotes, useUnarchiveNote, useDeleteNote } from '../hooks/useNotes';
import { useAppPreferences } from '../contexts/appPreferences';
import { useTags } from '../hooks/useTags';
import type { NoteType, Priority, Note } from '../types';
import './ArchivePage.css';

export function ArchivePage() {
  const { data: archivedNotes = [], isLoading } = useArchivedNotes();
  const { data: tags = [] } = useTags();
  const unarchiveMutation = useUnarchiveNote();
  const deleteMutation = useDeleteNote();
  const { t } = useAppPreferences();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const deleteTimerRef = useRef<number | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<NoteType | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [tagFilter, setTagFilter] = useState('');

  const filteredArchivedNotes = useMemo(() => {
    return archivedNotes.filter((note) => {
      const matchesSearch = !search
        || note.title.toLowerCase().includes(search.toLowerCase())
        || note.content.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || note.type === typeFilter;
      const matchesPriority = !priorityFilter || note.priority === priorityFilter;
      const matchesTag = !tagFilter || note.noteTags?.some((nt) => nt.tagId === tagFilter);
      return matchesSearch && matchesType && matchesPriority && matchesTag;
    });
  }, [archivedNotes, search, typeFilter, priorityFilter, tagFilter]);

  function clearFilters() {
    setSearch('');
    setTypeFilter('');
    setPriorityFilter('');
    setTagFilter('');
  }

  async function handleRestoreSelected() {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => unarchiveMutation.mutateAsync(id)));
    setSelectedIds([]);
  }

  function scheduleDelete(ids: string[]) {
    if (ids.length === 0) return;
    setPendingDeleteIds(ids);
    setSnackbarOpen(true);
    if (deleteTimerRef.current) globalThis.clearTimeout(deleteTimerRef.current);
    deleteTimerRef.current = globalThis.setTimeout(async () => {
      await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
      setPendingDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      setSnackbarOpen(false);
    }, 5000);
  }

  function undoDelete() {
    if (deleteTimerRef.current) globalThis.clearTimeout(deleteTimerRef.current);
    setPendingDeleteIds([]);
    setSnackbarOpen(false);
  }

  // Override NoteCard for archive view with unarchive button
  const ArchivedNoteCard = ({ note }: { note: Note }) => {
    return (
      <Card className="archive-note-card" onClick={() => {}}>
        <CardContent>
          <Stack direction="row" spacing={1} className="archive-note-header">
            <Typography variant="h6" noWrap>{note.title}</Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" className="archive-note-content">
            {note.summary ?? note.content}
          </Typography>
        </CardContent>
        <Stack direction="row" spacing={1} className="archive-note-actions">
          <Tooltip title={t('restore')}>
            <Button
              size="small"
              onClick={() => unarchiveMutation.mutate(note.id)}
              variant="outlined"
            >
              {t('restore')}
            </Button>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <Button
              size="small"
              color="error"
              variant="text"
              onClick={() => scheduleDelete([note.id])}
            >
              {t('delete')}
            </Button>
          </Tooltip>
        </Stack>
      </Card>
    );
  };

  return (
    <Box className="page-shell">
      <Stack direction={{ xs: 'column', sm: 'row' }} className="page-header">
        <Typography variant="h4" className="page-title">{t('archive')}</Typography>
      </Stack>

      <Card className="archive-filter-card">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              label={t('search')}
              fullWidth
            />

            <FormControl className="archive-filter-control">
              <InputLabel>{t('type')}</InputLabel>
              <Select
                label={t('type')}
                value={typeFilter}
                onChange={(e) => setTypeFilter((e.target.value as NoteType) || '')}
              >
                <MenuItem value="">{t('allTypes')}</MenuItem>
                {(['note', 'reminder', 'meeting', 'idea'] as NoteType[]).map((noteType) => (
                  <MenuItem key={noteType} value={noteType}>{noteType}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="archive-filter-control">
              <InputLabel>{t('priority')}</InputLabel>
              <Select
                label={t('priority')}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter((e.target.value as Priority) || '')}
              >
                <MenuItem value="">{t('allPriorities')}</MenuItem>
                {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="archive-filter-control">
              <InputLabel>{t('tag')}</InputLabel>
              <Select
                label={t('tag')}
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value || '')}
              >
                <MenuItem value="">{t('allTags')}</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>#{tag.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={clearFilters}>{t('clear')}</Button>
          </Stack>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="archive-selection-card">
          <CardContent>
            <Stack direction="row" className="archive-selected-actions">
              <Typography>{selectedIds.length} {t('selectedCount')}</Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleRestoreSelected}>{t('restoreSelected')}</Button>
                <Button color="error" variant="contained" onClick={() => scheduleDelete(selectedIds)}>{t('deleteSelected')}</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Typography>{t('loadingArchivedNotes')}</Typography>
      ) : filteredArchivedNotes.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">{search || typeFilter || priorityFilter || tagFilter ? t('noNotesFound') : t('noArchivedNotes')}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredArchivedNotes.map((note) => (
            <Grid key={note.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card className="archive-item-wrapper">
                <Checkbox
                  checked={selectedIds.includes(note.id)}
                  onChange={(e) => {
                    setSelectedIds((prev) =>
                      e.target.checked ? [...prev, note.id] : prev.filter((id) => id !== note.id)
                    );
                  }}
                />
                <ArchivedNoteCard note={note} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <Alert
          severity="warning"
          onClose={() => setSnackbarOpen(false)}
          action={<Button color="inherit" size="small" onClick={undoDelete}>{t('undo')}</Button>}
        >
          {pendingDeleteIds.length} {t('deleteSelected')}
        </Alert>
      </Snackbar>
    </Box>
  );
}
