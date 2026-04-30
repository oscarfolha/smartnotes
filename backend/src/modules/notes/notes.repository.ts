import prisma from '../../prisma/client';
import { CreateNoteDto, UpdateNoteDto, NoteFiltersDto, CreateFilterPresetDto } from './notes.dto';
import { Prisma } from '@prisma/client';

const noteInclude = {
  noteTags: { include: { tag: true } },
  reminder: true,
} satisfies Prisma.NoteInclude;

function appendActivity(metadata: unknown, event: string) {
  const base = (metadata && typeof metadata === 'object' ? metadata : {}) as Record<string, unknown>;
  const activity = Array.isArray(base.activity) ? base.activity : [];
  return {
    ...base,
    activity: [
      ...activity,
      {
        event,
        at: new Date().toISOString(),
      },
    ],
  };
}

export const notesRepository = {
  async findAll(filters: NoteFiltersDto) {
    const where: Prisma.NoteWhereInput = { archived: false };

    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;
    if (filters.tagId) {
      where.noteTags = { some: { tagId: filters.tagId } };
    }
    if (filters.date) {
      const d = new Date(filters.date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }
    if (filters.dateFrom || filters.dateTo) {
      where.date = {
        ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.note.findMany({
      where,
      include: noteInclude,
      orderBy: [{ date: 'desc' }, { order: 'asc' }],
    });
  },

  async findById(id: string) {
    return prisma.note.findUnique({ where: { id }, include: noteInclude });
  },

  async create(data: CreateNoteDto) {
    const { tagIds, remindAt, recurring, ...noteData } = data;

    const shouldCreatePersistentReminder = noteData.type === 'reminder';
    const shouldCreateScheduledReminder = !!remindAt;

    return prisma.note.create({
      data: {
        ...noteData,
        date: new Date(noteData.date),
        metadata: appendActivity(undefined, 'created'),
        noteTags: tagIds
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
        reminder:
          shouldCreatePersistentReminder || shouldCreateScheduledReminder
            ? {
                create: {
                  remindAt: shouldCreatePersistentReminder
                    ? new Date()
                    : new Date(remindAt as string),
                  recurring: recurring ?? false,
                  done: false,
                },
              }
            : undefined,
      },
      include: noteInclude,
    });
  },

  async update(id: string, data: UpdateNoteDto) {
    const { tagIds, remindAt, recurring, ...noteData } = data;

    const existing = await prisma.note.findUnique({
      where: { id },
      include: { reminder: true },
    });

    if (!existing) {
      throw new Error('Note not found');
    }

    // Handle tag replacement
    const tagOps =
      tagIds !== undefined
        ? {
            noteTags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {};

    let reminderOp: Prisma.NoteUpdateInput['reminder'] | undefined;

    if (noteData.type === 'reminder') {
      // Persistent reminder note: always keep active reminder.
      reminderOp = existing.reminder
        ? {
            update: {
              done: false,
              recurring: recurring ?? existing.reminder.recurring,
            },
          }
        : {
            create: {
              remindAt: new Date(),
              recurring: recurring ?? false,
              done: false,
            },
          };
    } else if (noteData.type && existing.reminder && !remindAt) {
      // Changing status away from reminder removes persistent notification.
      reminderOp = { delete: true };
    } else if (remindAt) {
      reminderOp = existing.reminder
        ? {
            update: {
              remindAt: new Date(remindAt),
              recurring: recurring ?? existing.reminder.recurring,
              done: false,
            },
          }
        : {
            create: {
              remindAt: new Date(remindAt),
              recurring: recurring ?? false,
              done: false,
            },
          };
    } else if (recurring !== undefined && existing.reminder) {
      reminderOp = {
        update: {
          recurring,
        },
      };
    }

    return prisma.note.update({
      where: { id },
      data: {
        ...noteData,
        metadata: appendActivity(existing.metadata, 'updated'),
        ...(noteData.date ? { date: new Date(noteData.date) } : {}),
        ...tagOps,
        ...(reminderOp ? { reminder: reminderOp } : {}),
      },
      include: noteInclude,
    });
  },

  async delete(id: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (existing) {
      await prisma.note.update({
        where: { id },
        data: { metadata: appendActivity(existing.metadata, 'deleted') },
      });
    }
    return prisma.note.delete({ where: { id } });
  },

  async reorderNotes(noteIds: string[]) {
    if (noteIds.length === 0) return [];

    // Performance: use one SQL statement instead of N ORM update calls.
    const orderCase = noteIds
      .map((id, index) => `WHEN '${id}' THEN ${index}`)
      .join(' ');
    const idsSql = noteIds.map((id) => `'${id}'`).join(',');
    await prisma.$executeRawUnsafe(
      `UPDATE "Note" SET "order" = CASE "id" ${orderCase} END WHERE "id" IN (${idsSql})`
    );

    return prisma.note.findMany({
      where: { id: { in: noteIds } },
      include: noteInclude,
      orderBy: { order: 'asc' },
    });
  },

  async findByDateWithOrder(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return prisma.note.findMany({
      where: {
        date: { gte: start, lte: end },
        archived: false,
      },
      include: noteInclude,
      orderBy: { order: 'asc' },
    });
  },

  async findArchived() {
    return prisma.note.findMany({
      where: { archived: true },
      include: noteInclude,
      orderBy: { updatedAt: 'desc' },
    });
  },

  async archive(id: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    return prisma.note.update({
      where: { id },
      data: {
        archived: true,
        ...(existing ? { metadata: appendActivity(existing.metadata, 'archived') } : {}),
      },
      include: noteInclude,
    });
  },

  async unarchive(id: string) {
    const existing = await prisma.note.findUnique({ where: { id } });
    return prisma.note.update({
      where: { id },
      data: {
        archived: false,
        ...(existing ? { metadata: appendActivity(existing.metadata, 'restored') } : {}),
      },
      include: noteInclude,
    });
  },

  async findFilterPresets() {
    return prisma.filterPreset.findMany({
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async createFilterPreset(data: CreateFilterPresetDto) {
    return prisma.filterPreset.create({ data });
  },

  async deleteFilterPreset(id: string) {
    return prisma.filterPreset.delete({ where: { id } });
  },
};
