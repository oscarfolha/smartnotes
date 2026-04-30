import { useMemo, useState, useCallback, useEffect } from 'react';
import { format, isSameMonth, isSameWeek, isSameYear } from 'date-fns';
import { Box, Card, CardContent, Grid, Stack, Typography, Fab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotes, useReorderNotes } from '../hooks/useNotes';
import { useRemindersStore } from '../store/reminders.store';
import { useNotesStore } from '../store/notes.store';
import { NoteCard } from '../components/notes/NoteCard';
import { useAppPreferences } from '../contexts/appPreferences';
import type { Note } from '../types';
import { splitFavoriteNotes } from '../utils/notes';
import './Dashboard.css';

type DashboardPeriod = 'week' | 'month' | 'year';
const DASHBOARD_PERIOD_SESSION_KEY = 'dashboard-view-period';

function reorder<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function Dashboard() {
  const { data: allNotes = [] } = useNotes();
  const { pendingReminders } = useRemindersStore();
  const { openModal } = useNotesStore();
  const { t } = useAppPreferences();
  const reorderMutation = useReorderNotes();
  const [period, setPeriod] = useState<DashboardPeriod>(() => {
    const saved = globalThis.sessionStorage.getItem(DASHBOARD_PERIOD_SESSION_KEY);
    if (saved === 'week' || saved === 'month' || saved === 'year') {
      return saved;
    }
    return 'week';
  });
  const [orderedPeriodNotes, setOrderedPeriodNotes] = useState<Note[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);

  const activeNotes = useMemo(() => allNotes.filter((note) => !note.archived), [allNotes]);
  const { favorites: favoriteNotes, regular: nonFavoriteNotes } = useMemo(
    () => splitFavoriteNotes(activeNotes),
    [activeNotes]
  );

  const periodNotes = useMemo(
    () =>
      nonFavoriteNotes
        .filter(
          (n) => {
            const noteDate = new Date(n.date);
            const now = new Date();
            if (period === 'week') return isSameWeek(noteDate, now, { weekStartsOn: 1 });
            if (period === 'month') return isSameMonth(noteDate, now);
            return isSameYear(noteDate, now);
          }
        )
        .sort((a, b) => a.order - b.order),
    [nonFavoriteNotes, period]
  );

  useEffect(() => {
    setOrderedPeriodNotes(periodNotes);
  }, [periodNotes]);

  useEffect(() => {
    globalThis.sessionStorage.setItem(DASHBOARD_PERIOD_SESSION_KEY, period);
  }, [period]);

  let currentPeriodLabel = t('thisYearNotes');
  if (period === 'week') {
    currentPeriodLabel = t('thisWeekNotes');
  } else if (period === 'month') {
    currentPeriodLabel = t('thisMonthNotes');
  }

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const newOrder = reorder(orderedPeriodNotes, from, to);
      setOrderedPeriodNotes(newOrder);
      // Persist to database
      reorderMutation.mutate(newOrder.map((n) => n.id));
      setDragId(null);
    },
    [orderedPeriodNotes, reorderMutation]
  );

  const stats = [
    {
      label: currentPeriodLabel,
      value: periodNotes.length,
    },
    { label: t('pendingReminders'), value: pendingReminders.length },
    { label: t('totalNotes'), value: activeNotes.length },
    { label: t('meetings'), value: activeNotes.filter((n) => n.type === 'meeting').length },
  ];

  return (
    <Box className="page-shell">
      <Stack direction={{ xs: 'column', sm: 'row' }} className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">{t('dashboard')}</Typography>
          <Typography color="text.secondary">{format(new Date(), 'EEEE, MMMM d, yyyy')}</Typography>
        </Box>
        <FormControl size="small" className="dashboard-period-control">
          <InputLabel id="dashboard-period-label">{t('view')}</InputLabel>
          <Select
            labelId="dashboard-period-label"
            value={period}
            label={t('view')}
            onChange={(e) => setPeriod(e.target.value as DashboardPeriod)}
          >
            <MenuItem value="week">{t('week')}</MenuItem>
            <MenuItem value="month">{t('month')}</MenuItem>
            <MenuItem value="year">{t('year')}</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={2} className="dashboard-stats-grid">
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" className="dashboard-stat-value">{stat.value}</Typography>
                <Typography color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pendingReminders.length > 0 && (
        <Card className="dashboard-reminders-card">
          <CardContent>
            <Typography color="error.main" className="dashboard-reminders-title">
              {t('pendingReminders')}: {pendingReminders.length}
            </Typography>
            <Typography color="text.secondary">{t('reminderHint')}</Typography>
          </CardContent>
        </Card>
      )}

      {favoriteNotes.length > 0 && (
        <>
          <Typography variant="h6" className="dashboard-notes-title">
            {t('favorite')} ({favoriteNotes.length})
          </Typography>
          <Grid container spacing={2} className="dashboard-favorite-grid">
            {favoriteNotes.map((note) => (
              <Grid key={note.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <NoteCard note={note} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Typography variant="h6" className="dashboard-notes-title">
        {currentPeriodLabel} (drag to reorder)
      </Typography>
      {orderedPeriodNotes.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">{t('noNotesSelectedPeriod')}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {orderedPeriodNotes.map((note) => (
            <Grid
              key={note.id}
              size={{ xs: 12, sm: 6, lg: 4 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!dragId || dragId === note.id) return;
                const from = orderedPeriodNotes.findIndex((n) => n.id === dragId);
                const to = orderedPeriodNotes.findIndex((n) => n.id === note.id);
                if (from < 0 || to < 0) return;
                handleReorder(from, to);
              }}
            >
              <NoteCard
                note={note}
                draggable
                onDragStart={() => setDragId(note.id)}
                onDragEnd={() => setDragId(null)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        className="page-fab"
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 24 },
          bottom: { xs: 16, md: 24 },
          zIndex: 1300,
        }}
        color="primary"
        aria-label="add note"
        onClick={() => openModal({ initialDate: new Date().toISOString() })}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
