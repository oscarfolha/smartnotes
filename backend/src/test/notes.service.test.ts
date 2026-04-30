import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../modules/notes/notes.repository', () => ({
  notesRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    reorderNotes: vi.fn(),
    archive: vi.fn(),
    unarchive: vi.fn(),
    findArchived: vi.fn(),
    findFilterPresets: vi.fn(),
    createFilterPreset: vi.fn(),
    deleteFilterPreset: vi.fn(),
  },
}));

vi.mock('../modules/ai/ai.service', () => ({
  aiService: {
    summarize: vi.fn().mockResolvedValue(null),
    extractMeetingData: vi.fn().mockResolvedValue(null),
    smartTransform: vi.fn().mockResolvedValue(null),
  },
}));

import { notesService } from '../modules/notes/notes.service';
import { notesRepository } from '../modules/notes/notes.repository';

describe('notesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws 404 when getById misses', async () => {
    vi.mocked(notesRepository.findById).mockResolvedValue(null as any);
    await expect(notesService.getById('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('reorders notes via repository', async () => {
    vi.mocked(notesRepository.reorderNotes).mockResolvedValue([] as any);
    await notesService.reorderNotes(['1', '2']);
    expect(notesRepository.reorderNotes).toHaveBeenCalledWith(['1', '2']);
  });

  it('returns archived notes', async () => {
    vi.mocked(notesRepository.findArchived).mockResolvedValue([{ id: 'a' }] as any);
    const res = await notesService.getArchived();
    expect(res).toEqual([{ id: 'a' }]);
  });

  it('returns filter presets', async () => {
    vi.mocked(notesRepository.findFilterPresets).mockResolvedValue([{ id: 'p1', name: 'Work' }] as any);
    const res = await notesService.getFilterPresets();
    expect(res).toEqual([{ id: 'p1', name: 'Work' }]);
  });

  it('creates filter preset', async () => {
    vi.mocked(notesRepository.createFilterPreset).mockResolvedValue({ id: 'p2', name: 'Urgent' } as any);
    const res = await notesService.createFilterPreset({ name: 'Urgent' });
    expect(notesRepository.createFilterPreset).toHaveBeenCalledWith({ name: 'Urgent' });
    expect(res).toEqual({ id: 'p2', name: 'Urgent' });
  });
});
