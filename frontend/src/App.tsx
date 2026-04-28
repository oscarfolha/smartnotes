import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { NotesPage } from './pages/NotesPage';
import { ArchivePage } from './pages/ArchivePage';
import { NoteModal } from './components/notes/NoteModal';
import { ReminderPopup } from './components/reminders/ReminderPopup';
import { AIChatBox } from './components/ai/AIChatBox';
import { PendingRemindersLoader } from './components/reminders/PendingRemindersLoader';
import { AppPreferencesProvider, useAppPreferences } from './contexts/appPreferences';
import './App.css';
import './styles/layout.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function AppContent() {
  const { themeMode } = useAppPreferences();
  const isChatbotEnabled = import.meta.env.VITE_ENABLE_CHATBOT === 'true';
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: { main: '#4f46e5' },
          secondary: { main: '#0f766e' },
          background:
            themeMode === 'dark'
              ? { default: '#0f131d', paper: '#151b26' }
              : { default: '#f3f4f8' },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <PendingRemindersLoader />
        <CommandPalette />
        <ReminderPopup />
        <NoteModal />
        {isChatbotEnabled && <AIChatBox />}
        <Box className="app-shell" data-chatbot-enabled={isChatbotEnabled ? 'true' : 'false'}>
          <Navbar />
          <Box component="main" className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/archive" element={<ArchivePage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppPreferencesProvider>
        <AppContent />
      </AppPreferencesProvider>
    </QueryClientProvider>
  );
}
