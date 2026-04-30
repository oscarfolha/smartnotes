import { describe, expect, it } from 'vitest';
import { buildFilterPreset } from './NotesPage';

describe('NotesPage preset helpers', () => {
  it('builds preset with all active filters', () => {
    const preset = buildFilterPreset('work', 'meeting', {
      type: 'meeting',
      priority: 'high',
      tagId: 'tag-123',
    });

    expect(preset).toEqual({
      name: 'work',
      search: 'meeting',
      type: 'meeting',
      priority: 'high',
      tagId: 'tag-123',
    });
  });

  it('omits empty search from preset', () => {
    const preset = buildFilterPreset('empty-search', '', {
      type: undefined,
      priority: undefined,
      tagId: undefined,
    });

    expect(preset.search).toBeUndefined();
  });
});
