import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AppLanguage = 'en' | 'pt' | 'es';
export type AppThemeMode = 'light' | 'dark';

type TranslationKey =
  | 'appName'
  | 'favorite'
  | 'dashboard'
  | 'calendar'
  | 'notes'
  | 'archive'
  | 'newNote'
  | 'view'
  | 'week'
  | 'month'
  | 'year'
  | 'thisWeekNotes'
  | 'thisMonthNotes'
  | 'thisYearNotes'
  | 'pendingReminders'
  | 'totalNotes'
  | 'meetings'
  | 'noNotesSelectedPeriod'
  | 'loadingNotes'
  | 'noNotesFound'
  | 'search'
  | 'type'
  | 'priority'
  | 'tag'
  | 'allTypes'
  | 'allPriorities'
  | 'allTags'
  | 'clear'
  | 'loadingArchivedNotes'
  | 'noArchivedNotes'
  | 'restore'
  | 'delete'
  | 'editNote'
  | 'title'
  | 'content'
  | 'date'
  | 'cancel'
  | 'create'
  | 'update'
  | 'reminder'
  | 'dismiss'
  | 'openNote'
  | 'markDone'
  | 'reminderHint'
  | 'theme'
  | 'language'
  | 'light'
  | 'dark'
  | 'archiveSelected'
  | 'restoreSelected'
  | 'deleteSelected'
  | 'selectedCount'
  | 'savePreset'
  | 'presetName'
  | 'loadPreset'
  | 'removePreset'
  | 'weeklyMeetingTemplate'
  | 'commandPalette'
  | 'undo'
  | 'archivedSuccess'
  | 'deletedSuccess'
  | 'restoredSuccess'
  | 'askAiPlaceholder'
  | 'aiThinking'
  | 'aiAssistantTitle'
  | 'aiHelperText'
  | 'calendar_time'
  | 'calendar_event'
  | 'calendar_allDay'
  | 'calendar_workWeek'
  | 'calendar_day'
  | 'calendar_previous'
  | 'calendar_next'
  | 'calendar_yesterday'
  | 'calendar_tomorrow'
  | 'calendar_today'
  | 'calendar_agenda'
  | 'calendar_noEventsInRange'
  | 'calendar_showMore'
  | 'noteType_note'
  | 'noteType_reminder'
  | 'noteType_meeting'
  | 'noteType_idea'
  | 'priority_low'
  | 'priority_medium'
  | 'priority_high'
  | 'activityTimeline'
  | 'activity_created'
  | 'activity_updated'
  | 'activity_archived'
  | 'activity_restored'
  | 'activity_deleted'
  | 'tags'
  | 'newTagPlaceholder'
  | 'add'
  | 'saving'
  | 'reminderPersistentHint';

type TranslationMap = Record<TranslationKey, string>;

const translations: Record<AppLanguage, TranslationMap> = {
  en: {
    appName: 'Smart Notes',
    favorite: 'Favorite',
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    notes: 'Notes',
    archive: 'Archive',
    newNote: 'New Note',
    view: 'View',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    thisWeekNotes: "This Week's Notes",
    thisMonthNotes: "This Month's Notes",
    thisYearNotes: "This Year's Notes",
    pendingReminders: 'Pending Reminders',
    totalNotes: 'Total Notes',
    meetings: 'Meetings',
    noNotesSelectedPeriod: 'No notes for selected period.',
    loadingNotes: 'Loading notes...',
    noNotesFound: 'No notes found.',
    search: 'Search',
    type: 'Type',
    priority: 'Priority',
    tag: 'Tag',
    allTypes: 'All types',
    allPriorities: 'All priorities',
    allTags: 'All tags',
    clear: 'Clear',
    loadingArchivedNotes: 'Loading archived notes...',
    noArchivedNotes: 'No archived notes yet.',
    restore: 'Restore',
    delete: 'Delete',
    editNote: 'Edit Note',
    title: 'Title',
    content: 'Content',
    date: 'Date',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    reminder: 'Reminder',
    dismiss: 'Dismiss',
    openNote: 'Open note',
    markDone: 'Mark done',
    reminderHint: 'This reminder will keep showing on dashboard until you mark it done or change note type.',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    archiveSelected: 'Archive selected',
    restoreSelected: 'Restore selected',
    deleteSelected: 'Delete selected',
    selectedCount: 'selected',
    savePreset: 'Save preset',
    presetName: 'Preset name',
    loadPreset: 'Load preset',
    removePreset: 'Remove preset',
    weeklyMeetingTemplate: 'Create weekly meeting template',
    commandPalette: 'Command palette',
    undo: 'Undo',
    archivedSuccess: 'Note archived',
    deletedSuccess: 'Note deleted',
    restoredSuccess: 'Note restored',
    askAiPlaceholder: 'Ask your assistant...',
    aiThinking: 'AI is thinking...',
    aiAssistantTitle: 'Smart Notes Assistant',
    aiHelperText: 'Ask about your notes, summary, meetings, or reminders',
    calendar_time: 'Time',
    calendar_event: 'Event',
    calendar_allDay: 'All day',
    calendar_workWeek: 'Work week',
    calendar_day: 'Day',
    calendar_previous: 'Back',
    calendar_next: 'Next',
    calendar_yesterday: 'Yesterday',
    calendar_tomorrow: 'Tomorrow',
    calendar_today: 'Today',
    calendar_agenda: 'Agenda',
    calendar_noEventsInRange: 'No events in this range',
    calendar_showMore: '+{count} more',
    noteType_note: 'Note',
    noteType_reminder: 'Reminder',
    noteType_meeting: 'Meeting',
    noteType_idea: 'Idea',
    priority_low: 'Low',
    priority_medium: 'Medium',
    priority_high: 'High',
    activityTimeline: 'Activity timeline',
    activity_created: 'Created',
    activity_updated: 'Updated',
    activity_archived: 'Archived',
    activity_restored: 'Restored',
    activity_deleted: 'Deleted',
    tags: 'Tags',
    newTagPlaceholder: 'New tag...',
    add: 'Add',
    saving: 'Saving...',
    reminderPersistentHint: 'Reminder notifications are persistent. You will keep receiving them on dashboard until you mark them done or change note type.',
  },
  pt: {
    appName: 'Smart Notes',
    favorite: 'Favorita',
    dashboard: 'Painel',
    calendar: 'Calendario',
    notes: 'Notas',
    archive: 'Arquivo',
    newNote: 'Nova Nota',
    view: 'Visualizacao',
    week: 'Semana',
    month: 'Mes',
    year: 'Ano',
    thisWeekNotes: 'Notas desta semana',
    thisMonthNotes: 'Notas deste mes',
    thisYearNotes: 'Notas deste ano',
    pendingReminders: 'Lembretes pendentes',
    totalNotes: 'Total de notas',
    meetings: 'Reunioes',
    noNotesSelectedPeriod: 'Nenhuma nota para o periodo selecionado.',
    loadingNotes: 'Carregando notas...',
    noNotesFound: 'Nenhuma nota encontrada.',
    search: 'Pesquisar',
    type: 'Tipo',
    priority: 'Prioridade',
    tag: 'Tag',
    allTypes: 'Todos os tipos',
    allPriorities: 'Todas as prioridades',
    allTags: 'Todas as tags',
    clear: 'Limpar',
    loadingArchivedNotes: 'Carregando notas arquivadas...',
    noArchivedNotes: 'Nenhuma nota arquivada ainda.',
    restore: 'Restaurar',
    delete: 'Excluir',
    editNote: 'Editar Nota',
    title: 'Titulo',
    content: 'Conteudo',
    date: 'Data',
    cancel: 'Cancelar',
    create: 'Criar',
    update: 'Atualizar',
    reminder: 'Lembrete',
    dismiss: 'Dispensar',
    openNote: 'Abrir nota',
    markDone: 'Concluir',
    reminderHint: 'Este lembrete continuara aparecendo no painel ate voce marca-lo como concluido ou alterar o tipo da nota.',
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Escuro',
    archiveSelected: 'Arquivar selecionadas',
    restoreSelected: 'Restaurar selecionadas',
    deleteSelected: 'Excluir selecionadas',
    selectedCount: 'selecionadas',
    savePreset: 'Salvar filtro',
    presetName: 'Nome do filtro',
    loadPreset: 'Carregar filtro',
    removePreset: 'Remover filtro',
    weeklyMeetingTemplate: 'Criar modelo semanal de reuniao',
    commandPalette: 'Paleta de comandos',
    undo: 'Desfazer',
    archivedSuccess: 'Nota arquivada',
    deletedSuccess: 'Nota excluida',
    restoredSuccess: 'Nota restaurada',
    askAiPlaceholder: 'Pergunte ao assistente...',
    aiThinking: 'IA esta pensando...',
    aiAssistantTitle: 'Assistente Smart Notes',
    aiHelperText: 'Pergunte sobre notas, resumo, reunioes ou lembretes',
    calendar_time: 'Hora',
    calendar_event: 'Evento',
    calendar_allDay: 'Dia inteiro',
    calendar_workWeek: 'Semana util',
    calendar_day: 'Dia',
    calendar_previous: 'Anterior',
    calendar_next: 'Proximo',
    calendar_yesterday: 'Ontem',
    calendar_tomorrow: 'Amanha',
    calendar_today: 'Hoje',
    calendar_agenda: 'Agenda',
    calendar_noEventsInRange: 'Sem eventos neste periodo',
    calendar_showMore: '+{count} mais',
    noteType_note: 'Nota',
    noteType_reminder: 'Lembrete',
    noteType_meeting: 'Reuniao',
    noteType_idea: 'Ideia',
    priority_low: 'Baixa',
    priority_medium: 'Media',
    priority_high: 'Alta',
    activityTimeline: 'Linha do tempo',
    activity_created: 'Criada',
    activity_updated: 'Atualizada',
    activity_archived: 'Arquivada',
    activity_restored: 'Restaurada',
    activity_deleted: 'Excluida',
    tags: 'Tags',
    newTagPlaceholder: 'Nova tag...',
    add: 'Adicionar',
    saving: 'Salvando...',
    reminderPersistentHint: 'Notificacoes de lembrete sao persistentes. Voce continuara recebendo no painel ate marcar como concluido ou alterar o tipo da nota.',
  },
  es: {
    appName: 'Smart Notes',
    favorite: 'Favorita',
    dashboard: 'Panel',
    calendar: 'Calendario',
    notes: 'Notas',
    archive: 'Archivo',
    newNote: 'Nueva Nota',
    view: 'Vista',
    week: 'Semana',
    month: 'Mes',
    year: 'Ano',
    thisWeekNotes: 'Notas de esta semana',
    thisMonthNotes: 'Notas de este mes',
    thisYearNotes: 'Notas de este ano',
    pendingReminders: 'Recordatorios pendientes',
    totalNotes: 'Notas totales',
    meetings: 'Reuniones',
    noNotesSelectedPeriod: 'No hay notas para el periodo seleccionado.',
    loadingNotes: 'Cargando notas...',
    noNotesFound: 'No se encontraron notas.',
    search: 'Buscar',
    type: 'Tipo',
    priority: 'Prioridad',
    tag: 'Etiqueta',
    allTypes: 'Todos los tipos',
    allPriorities: 'Todas las prioridades',
    allTags: 'Todas las etiquetas',
    clear: 'Limpiar',
    loadingArchivedNotes: 'Cargando notas archivadas...',
    noArchivedNotes: 'Aun no hay notas archivadas.',
    restore: 'Restaurar',
    delete: 'Eliminar',
    editNote: 'Editar Nota',
    title: 'Titulo',
    content: 'Contenido',
    date: 'Fecha',
    cancel: 'Cancelar',
    create: 'Crear',
    update: 'Actualizar',
    reminder: 'Recordatorio',
    dismiss: 'Descartar',
    openNote: 'Abrir nota',
    markDone: 'Marcar hecha',
    reminderHint: 'Este recordatorio seguira apareciendo en el panel hasta que lo marques como hecho o cambies el tipo de nota.',
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Oscuro',
    archiveSelected: 'Archivar seleccionadas',
    restoreSelected: 'Restaurar seleccionadas',
    deleteSelected: 'Eliminar seleccionadas',
    selectedCount: 'seleccionadas',
    savePreset: 'Guardar filtro',
    presetName: 'Nombre del filtro',
    loadPreset: 'Cargar filtro',
    removePreset: 'Eliminar filtro',
    weeklyMeetingTemplate: 'Crear plantilla semanal de reunion',
    commandPalette: 'Paleta de comandos',
    undo: 'Deshacer',
    archivedSuccess: 'Nota archivada',
    deletedSuccess: 'Nota eliminada',
    restoredSuccess: 'Nota restaurada',
    askAiPlaceholder: 'Pregunta al asistente...',
    aiThinking: 'La IA esta pensando...',
    aiAssistantTitle: 'Asistente Smart Notes',
    aiHelperText: 'Pregunta sobre notas, resumen, reuniones o recordatorios',
    calendar_time: 'Hora',
    calendar_event: 'Evento',
    calendar_allDay: 'Todo el dia',
    calendar_workWeek: 'Semana laboral',
    calendar_day: 'Dia',
    calendar_previous: 'Anterior',
    calendar_next: 'Siguiente',
    calendar_yesterday: 'Ayer',
    calendar_tomorrow: 'Manana',
    calendar_today: 'Hoy',
    calendar_agenda: 'Agenda',
    calendar_noEventsInRange: 'No hay eventos en este rango',
    calendar_showMore: '+{count} mas',
    noteType_note: 'Nota',
    noteType_reminder: 'Recordatorio',
    noteType_meeting: 'Reunion',
    noteType_idea: 'Idea',
    priority_low: 'Baja',
    priority_medium: 'Media',
    priority_high: 'Alta',
    activityTimeline: 'Linea de tiempo',
    activity_created: 'Creada',
    activity_updated: 'Actualizada',
    activity_archived: 'Archivada',
    activity_restored: 'Restaurada',
    activity_deleted: 'Eliminada',
    tags: 'Etiquetas',
    newTagPlaceholder: 'Nueva etiqueta...',
    add: 'Agregar',
    saving: 'Guardando...',
    reminderPersistentHint: 'Las notificaciones de recordatorio son persistentes. Seguiran apareciendo en el panel hasta que marques la nota como hecha o cambies su tipo.',
  },
};

interface AppPreferencesContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  t: (key: TranslationKey) => string;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

const LANGUAGE_KEY = 'app-language';
const THEME_KEY = 'app-theme-mode';

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const stored = globalThis.localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'en' || stored === 'pt' || stored === 'es') return stored;
    return 'en';
  });

  const [themeMode, setThemeMode] = useState<AppThemeMode>(() => {
    const stored = globalThis.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
  });

  useEffect(() => {
    globalThis.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    globalThis.localStorage.setItem(THEME_KEY, themeMode);
  }, [themeMode]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      language,
      setLanguage,
      themeMode,
      setThemeMode,
      t: (key) => translations[language][key],
    }),
    [language, themeMode]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
    throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  }
  return ctx;
}
