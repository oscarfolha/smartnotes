import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, FormControl, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAppPreferences } from '../../contexts/appPreferences';
import './Navbar.css';

export function Navbar() {
  const { pathname } = useLocation();
  const { t, language, setLanguage, themeMode, setThemeMode } = useAppPreferences();
  const links = [
    { to: '/', label: t('dashboard') },
    { to: '/calendar', label: t('calendar') },
    { to: '/notes', label: t('notes') },
    { to: '/archive', label: t('archive') },
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-brand">
          {t('appName')}
        </Typography>
        <Box className="navbar-links">
          {links.map(({ to, label }) => (
            <Button
              key={to}
              component={RouterLink}
              to={to}
              size="small"
              className="navbar-link"
              variant={pathname === to ? 'contained' : 'text'}
              color={pathname === to ? 'primary' : 'inherit'}
            >
              {label}
            </Button>
          ))}
        </Box>
        <Box className="navbar-controls">
          <FormControl size="small" className="navbar-language">
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
              displayEmpty
              aria-label={t('language')}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="pt">PT</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title={themeMode === 'dark' ? t('light') : t('dark')}>
            <IconButton
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              aria-label={t('theme')}
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
