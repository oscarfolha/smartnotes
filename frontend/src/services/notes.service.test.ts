import { describe, expect, it, vi, beforeEach } from 'vitest';

const { getMock, postMock, patchMock, deleteMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  patchMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock('./api', () => ({
  default: {
    get: getMock,
    post: postMock,
    patch: patchMock,
    delete: deleteMock,
  },
}));

import { notesApi } from './notes.service';

describe('notesApi', () => {
  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    patchMock.mockReset();
    deleteMock.mockReset();
  });

  it('calls reorder endpoint with ids payload', async () => {
    postMock.mockResolvedValue({ data: [] });
    await notesApi.reorder(['a', 'b']);
    expect(postMock).toHaveBeenCalledWith('/notes/reorder', { noteIds: ['a', 'b'] });
  });

  it('calls archive and unarchive endpoints', async () => {
    patchMock.mockResolvedValue({ data: {} });
    await notesApi.archive('n1');
    await notesApi.unarchive('n1');

    expect(patchMock).toHaveBeenNthCalledWith(1, '/notes/n1/archive');
    expect(patchMock).toHaveBeenNthCalledWith(2, '/notes/n1/unarchive');
  });

  it('calls preset endpoints', async () => {
    getMock.mockResolvedValue({ data: [] });
    postMock.mockResolvedValue({ data: { id: 'p1' } });
    deleteMock.mockResolvedValue({});

    await notesApi.getPresets();
    await notesApi.createPreset({ name: 'Work', search: 'meeting' });
    await notesApi.deletePreset('p1');

    expect(getMock).toHaveBeenCalledWith('/notes/presets');
    expect(postMock).toHaveBeenCalledWith('/notes/presets', { name: 'Work', search: 'meeting' });
    expect(deleteMock).toHaveBeenCalledWith('/notes/presets/p1');
  });
});
