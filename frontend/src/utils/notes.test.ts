import { describe, expect, it } from 'vitest';
import type { Note } from '../types';
import { sortFavoritesFirst, splitFavoriteNotes } from './notes';

function buildNote(id: string, favorite: boolean, order: number): Note {
  return {
    id,
    title: id,
    content: id,
    type: 'note',
    date: new Date().toISOString(),
    priority: 'medium',
    favorite,
    order,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    noteTags: [],
  };
}

describe('notes favorites helpers', () => {
  it('sorts favorites first preserving order among same favorite group', () => {
    const input = [
      buildNote('a', false, 2),
      buildNote('b', true, 5),
      buildNote('c', false, 0),
      buildNote('d', true, 1),
    ];

    const result = sortFavoritesFirst(input).map((note) => note.id);
    expect(result).toEqual(['d', 'b', 'c', 'a']);
  });

  it('splits favorites and regular notes', () => {
    const input = [buildNote('a', true, 0), buildNote('b', false, 1), buildNote('c', true, 2)];
    const { favorites, regular } = splitFavoriteNotes(input);

    expect(favorites.map((n) => n.id)).toEqual(['a', 'c']);
    expect(regular.map((n) => n.id)).toEqual(['b']);
  });
});
