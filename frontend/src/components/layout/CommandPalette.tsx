import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { useAppPreferences } from '../../contexts/appPreferences';
import { useNotesStore } from '../../store/notes.store';
import './CommandPalette.css';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t, setThemeMode, themeMode } = useAppPreferences();
  const { openModal } = useNotesStore();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    globalThis.addEventListener('keydown', onKeyDown);
    return () => globalThis.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands = useMemo(
    () => [
      {
        id: 'new-note',
        label: t('newNote'),
        action: () => openModal({ initialDate: new Date().toISOString() }),
      },
      {
        id: 'go-notes',
        label: t('notes'),
        action: () => navigate('/notes'),
      },
      {
        id: 'go-archive',
        label: t('archive'),
        action: () => navigate('/archive'),
      },
      {
        id: 'toggle-theme',
        label: `${t('theme')}: ${themeMode === 'dark' ? t('light') : t('dark')}`,
        action: () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark'),
      },
    ],
    [navigate, openModal, setThemeMode, t, themeMode]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{t('commandPalette')}</DialogTitle>
      <DialogContent>
        <TextField
          className="command-palette-search"
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
        />
        <List>
          {filtered.map((command) => (
            <ListItemButton
              key={command.id}
              onClick={() => {
                command.action();
                setOpen(false);
                setQuery('');
              }}
            >
              <ListItemText primary={command.label} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
