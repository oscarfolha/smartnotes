import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AppLanguage = 'en' | 'pt' | 'es';
export type AppThemeMode = 'light' | 'dark';

type TranslationKey =
  | 'appName'
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
  | 'aiHelperText';

type TranslationMap = Record<TranslationKey, string>;

const translations: Record<AppLanguage, TranslationMap> = {
  en: {
    appName: 'Smart Notes',
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
  },
  pt: {
    appName: 'Smart Notes',
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
  },
  es: {
    appName: 'Smart Notes',
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
