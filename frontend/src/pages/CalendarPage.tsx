import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ptBR } from 'date-fns/locale/pt-BR';
import { es } from 'date-fns/locale/es';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNotes } from '../hooks/useNotes';
import { useNotesStore } from '../store/notes.store';
import { useAppPreferences } from '../contexts/appPreferences';
import type { Note } from '../types';
import './CalendarPage.css';

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Note;
};

const locales = {
  'en-US': enUS,
  'pt-BR': ptBR,
  'es-ES': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TYPE_BG: Record<string, string> = {
  reminder: '#EF4444',
  meeting: '#3B82F6',
  note: '#6B7280',
  idea: '#F59E0B',
};

export function CalendarPage() {
  const { data: notes = [] } = useNotes();
  const { openModal } = useNotesStore();
  const { t, language } = useAppPreferences();
    const culture = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US';

    const messages = useMemo(
      () => ({
        date: t('date'),
        time: t('calendar_time'),
        event: t('calendar_event'),
        allDay: t('calendar_allDay'),
        week: t('week'),
        work_week: t('calendar_workWeek'),
        day: t('calendar_day'),
        month: t('month'),
        previous: t('calendar_previous'),
        next: t('calendar_next'),
        yesterday: t('calendar_yesterday'),
        tomorrow: t('calendar_tomorrow'),
        today: t('calendar_today'),
        agenda: t('calendar_agenda'),
        noEventsInRange: t('calendar_noEventsInRange'),
        showMore: (total: number) => t('calendar_showMore').replace('{count}', String(total)),
      }),
      [t]
    );

  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const events: CalendarEvent[] = notes.map((note: Note) => ({
    id: note.id,
    title: note.title,
    start: new Date(note.date),
    end: new Date(note.date),
    resource: note,
  }));

  function eventStyleGetter(event: CalendarEvent) {
    return {
      style: {
        backgroundColor: TYPE_BG[event.resource.type] ?? '#6B7280',
        borderRadius: '6px',
        border: 'none',
        color: '#fff',
        fontSize: '12px',
      },
    };
  }

  return (
    <Box className="page-shell">
      <Stack direction={{ xs: 'column', sm: 'row' }} className="page-header">
        <Typography variant="h4" className="page-title">{t('calendar')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openModal({ initialDate: new Date().toISOString() })}>
          {t('newNote')}
        </Button>
      </Stack>

      <Card className="calendar-card">
        <Calendar<CalendarEvent>
          localizer={localizer}
          culture={culture}
          messages={messages}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          className="calendar-widget"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => openModal({ noteId: event.id })}
          onSelectSlot={(slot) => {
            openModal({ initialDate: slot.start.toISOString() });
          }}
          selectable
          popup
        />
      </Card>
    </Box>
  );
}
