import { useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotes, useArchiveNote, useCreateNote, useNotePresets, useCreateNotePreset, useDeleteNotePreset } from '../hooks/useNotes';
import { useNotesStore } from '../store/notes.store';
import { useTags } from '../hooks/useTags';
import { NoteCard } from '../components/notes/NoteCard';
import { useAppPreferences } from '../contexts/appPreferences';
import type { NoteType, Priority, NoteFilterPreset } from '../types';
import { splitFavoriteNotes } from '../utils/notes';
import { noteTypeLabel, priorityLabel } from '../utils/i18n';
import './NotesPage.css';

export function buildFilterPreset(
  name: string,
  search: string,
  filters: { type?: NoteType; priority?: Priority; tagId?: string }
): Pick<NoteFilterPreset, 'name' | 'search' | 'type' | 'priority' | 'tagId'> {
  return {
    name,
    search: search || undefined,
    type: filters.type,
    priority: filters.priority,
    tagId: filters.tagId,
  };
}

export function NotesPage() {
  const { filters, setFilters, clearFilters, openModal } = useNotesStore();
  const { data: notes = [], isLoading } = useNotes();
  const { data: tags = [] } = useTags();
  const archiveNote = useArchiveNote();
  const createNote = useCreateNote();
  const { data: presets = [] } = useNotePresets();
  const createPresetMutation = useCreateNotePreset();
  const deletePresetMutation = useDeleteNotePreset();
  const { t } = useAppPreferences();
  const [search, setSearch] = useState(filters.search ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [presetName, setPresetName] = useState('');
  const [presetToLoad, setPresetToLoad] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const visibleNotes = useMemo(() => notes.filter((n) => !n.archived), [notes]);
  const { favorites: favoriteNotes, regular: regularNotes } = useMemo(
    () => splitFavoriteNotes(visibleNotes),
    [visibleNotes]
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setFilters({ search: e.target.value || undefined });
  }

  async function handleArchiveSelected() {
    if (selectedIds.length === 0) return;
    await Promise.all(selectedIds.map((id) => archiveNote.mutateAsync(id)));
    setSelectedIds([]);
    setSnackbarMessage(`${selectedIds.length} ${t('archiveSelected')}`);
  }

  async function savePreset() {
    const name = presetName.trim();
    if (!name) return;
    const latestFilters = useNotesStore.getState().filters;
    const nextPreset = buildFilterPreset(name, search, {
      type: latestFilters.type,
      priority: latestFilters.priority,
      tagId: latestFilters.tagId,
    });
    const created = await createPresetMutation.mutateAsync(nextPreset);
    setPresetToLoad(created.id);
    setPresetName('');
  }

  function loadPreset(id: string) {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setSearch(preset.search ?? '');
    setFilters({
      search: preset.search,
      type: preset.type,
      priority: preset.priority,
      tagId: preset.tagId,
    });
  }

  async function removePreset(id: string) {
    await deletePresetMutation.mutateAsync(id);
    if (presetToLoad === id) setPresetToLoad('');
  }

  function toggleSelectedNote(noteId: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? [...prev, noteId] : prev.filter((id) => id !== noteId)));
  }

  const isEmpty = visibleNotes.length === 0;

  async function createWeeklyTemplate() {
    await createNote.mutateAsync({
      title: 'Weekly Meeting',
      content: 'Agenda:\n- Updates\n- Blockers\n- Next actions',
      type: 'meeting',
      date: new Date().toISOString(),
      priority: 'medium',
    });
    setSnackbarMessage(t('weeklyMeetingTemplate'));
  }

  return (
    <Box className="page-shell">
      <Stack direction={{ xs: 'column', sm: 'row' }} className="page-header">
        <Typography variant="h4" className="page-title">{t('notes')}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Tooltip title={t('weeklyMeetingTemplate')}>
            <Button variant="outlined" onClick={createWeeklyTemplate}>{t('weeklyMeetingTemplate')}</Button>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openModal({ initialDate: new Date().toISOString() })}>
          {t('newNote')}
          </Button>
        </Stack>
      </Stack>

      <Card className="notes-filter-card">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              value={search}
              onChange={handleSearch}
              label={t('search')}
              fullWidth
            />

            <FormControl className="notes-filter-control">
              <InputLabel>{t('type')}</InputLabel>
              <Select
                label={t('type')}
                value={filters.type ?? ''}
                onChange={(e) => setFilters({ type: (e.target.value as NoteType) || undefined })}
              >
                <MenuItem value="">{t('allTypes')}</MenuItem>
                {(['note', 'reminder', 'meeting', 'idea'] as NoteType[]).map((noteTypeOption) => (
                  <MenuItem key={noteTypeOption} value={noteTypeOption}>{noteTypeLabel(noteTypeOption, t)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="notes-filter-control">
              <InputLabel>{t('priority')}</InputLabel>
              <Select
                label={t('priority')}
                value={filters.priority ?? ''}
                onChange={(e) => setFilters({ priority: (e.target.value as Priority) || undefined })}
              >
                <MenuItem value="">{t('allPriorities')}</MenuItem>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <MenuItem key={p} value={p}>{priorityLabel(p, t)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="notes-filter-control">
              <InputLabel>{t('tag')}</InputLabel>
              <Select
                label={t('tag')}
                value={filters.tagId ?? ''}
                onChange={(e) => setFilters({ tagId: e.target.value || undefined })}
              >
                <MenuItem value="">{t('allTags')}</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>#{tag.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={clearFilters}>{t('clear')}</Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} className="notes-preset-stack">
            <TextField
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              label={t('presetName')}
              size="small"
            />
            <Button onClick={savePreset} variant="outlined">{t('savePreset')}</Button>
            <FormControl className="notes-preset-load" size="small">
              <InputLabel>{t('loadPreset')}</InputLabel>
              <Select
                fullWidth
                label={t('loadPreset')}
                value={presetToLoad}
                onChange={(e) => {
                  const value = e.target.value;
                  setPresetToLoad(value);
                  loadPreset(value);
                }}
              >
                <MenuItem value="">-</MenuItem>
                {presets.map((preset) => (
                  <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={() => presetToLoad && removePreset(presetToLoad)}
              variant="text"
              color="error"
              disabled={!presetToLoad}
            >
              {t('removePreset')}
            </Button>
          </Stack>

          {presets.length > 0 && (
            <Stack direction="row" spacing={1} className="notes-quick-presets">
              {presets.map((preset) => (
                <Button
                  key={`quick-${preset.id}`}
                  variant={presetToLoad === preset.id ? 'contained' : 'text'}
                  size="small"
                  onClick={() => {
                    setPresetToLoad(preset.id);
                    loadPreset(preset.id);
                  }}
                >
                  {preset.name}
                </Button>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="notes-selection-card">
          <CardContent>
            <Stack direction="row" className="notes-selected-actions">
              <Typography>{selectedIds.length} {t('selectedCount')}</Typography>
              <Button variant="contained" color="warning" onClick={handleArchiveSelected}>
                {t('archiveSelected')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {isLoading && <Typography color="text.secondary">{t('loadingNotes')}</Typography>}

      {!isLoading && isEmpty && (
        <Card>
          <CardContent>
            <Typography color="text.secondary">{t('noNotesFound')}</Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isEmpty && favoriteNotes.length > 0 && (
        <>
          <Typography variant="h6" className="notes-favorites-title">{t('favorite')}</Typography>
          <Grid container spacing={2} className="notes-favorites-grid">
            {favoriteNotes.map((note) => (
              <Grid key={note.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card className="notes-item-wrapper">
                  <Checkbox
                    checked={selectedIds.includes(note.id)}
                    onChange={(e) => toggleSelectedNote(note.id, e.target.checked)}
                  />
                  <NoteCard note={note} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {!isLoading && !isEmpty && regularNotes.length > 0 && (
        <Grid container spacing={2}>
          {regularNotes.map((note) => (
            <Grid key={note.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card className="notes-item-wrapper">
                <Checkbox
                  checked={selectedIds.includes(note.id)}
                  onChange={(e) => toggleSelectedNote(note.id, e.target.checked)}
                />
                <NoteCard note={note} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={!!snackbarMessage} autoHideDuration={2500} onClose={() => setSnackbarMessage(null)}>
        <Alert severity="success" onClose={() => setSnackbarMessage(null)}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}
