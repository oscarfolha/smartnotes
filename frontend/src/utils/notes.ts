import type { Note } from '../types';

export function splitFavoriteNotes(notes: Note[]) {
  const favorites = notes.filter((note) => note.favorite);
  const regular = notes.filter((note) => !note.favorite);
  return { favorites, regular };
}

export function sortFavoritesFirst(notes: Note[]) {
  return [...notes].sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return a.order - b.order;
  });
}
