import { describe, expect, it } from 'vitest';
import { CreateNoteSchema, UpdateNoteSchema, CreateFilterPresetSchema } from '../modules/notes/notes.dto';

describe('notes dto', () => {
  it('accepts favorite on create payload', () => {
    const parsed = CreateNoteSchema.parse({
      title: 'Favorite note',
      content: 'Important content',
      type: 'note',
      date: new Date().toISOString(),
      priority: 'medium',
      favorite: true,
    });

    expect(parsed.favorite).toBe(true);
  });

  it('accepts favorite on update payload', () => {
    const parsed = UpdateNoteSchema.parse({ favorite: false });
    expect(parsed.favorite).toBe(false);
  });

  it('accepts filter preset payload', () => {
    const parsed = CreateFilterPresetSchema.parse({
      name: 'Meetings',
      search: 'standup',
      type: 'meeting',
      priority: 'high',
    });
    expect(parsed.name).toBe('Meetings');
    expect(parsed.type).toBe('meeting');
  });
});
