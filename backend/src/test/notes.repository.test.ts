import { describe, it, expect, vi, beforeEach } from 'vitest';

const { executeRawUnsafe, findMany } = vi.hoisted(() => ({
  executeRawUnsafe: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock('../prisma/client', () => ({
  default: {
    $executeRawUnsafe: executeRawUnsafe,
    note: {
      findMany,
    },
  },
}));

import { notesRepository } from '../modules/notes/notes.repository';

describe('notesRepository', () => {
  beforeEach(() => {
    executeRawUnsafe.mockReset();
    findMany.mockReset();
  });

  it('uses raw SQL for reorder notes', async () => {
    executeRawUnsafe.mockResolvedValue(2);
    findMany.mockResolvedValue([{ id: '1', order: 0 }, { id: '2', order: 1 }]);

    const result = await notesRepository.reorderNotes(['1', '2']);

    expect(executeRawUnsafe).toHaveBeenCalledTimes(1);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: '1', order: 0 }, { id: '2', order: 1 }]);
  });
});
