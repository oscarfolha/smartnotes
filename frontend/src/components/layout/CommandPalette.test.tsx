import { describe, expect, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { AppPreferencesProvider } from '../../contexts/appPreferences';

describe('CommandPalette', () => {
  it('opens with Ctrl+K shortcut', () => {
    render(
      <MemoryRouter>
        <AppPreferencesProvider>
          <CommandPalette />
        </AppPreferencesProvider>
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByText('Command palette')).toBeInTheDocument();
  });
});
