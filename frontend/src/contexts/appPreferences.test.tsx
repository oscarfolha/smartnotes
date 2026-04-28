import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppPreferencesProvider, useAppPreferences } from './appPreferences';

describe('AppPreferencesProvider', () => {
  it('defaults to english and light mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppPreferencesProvider>{children}</AppPreferencesProvider>
    );
    const { result } = renderHook(() => useAppPreferences(), { wrapper });

    expect(result.current.language).toBe('en');
    expect(result.current.themeMode).toBe('light');
    expect(result.current.t('dashboard')).toBe('Dashboard');
  });

  it('updates language and theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppPreferencesProvider>{children}</AppPreferencesProvider>
    );
    const { result } = renderHook(() => useAppPreferences(), { wrapper });

    act(() => {
      result.current.setLanguage('pt');
      result.current.setThemeMode('dark');
    });

    expect(result.current.language).toBe('pt');
    expect(result.current.themeMode).toBe('dark');
    expect(result.current.t('notes')).toBe('Notas');
  });
});
