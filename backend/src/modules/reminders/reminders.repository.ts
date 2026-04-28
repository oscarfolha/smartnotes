import prisma from '../../prisma/client';

export const remindersRepository = {
  async findPending() {
    return prisma.reminder.findMany({
      where: {
        done: false,
        note: {
          type: 'reminder',
        },
      },
      include: { note: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findAll() {
    return prisma.reminder.findMany({
      include: { note: true },
      orderBy: { remindAt: 'asc' },
    });
  },

  async findById(id: string) {
    return prisma.reminder.findUnique({ where: { id }, include: { note: true } });
  },

  async markDone(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: { done: true },
    });
  },

  async snooze(id: string, snoozedTo: Date) {
    return prisma.reminder.update({
      where: { id },
      data: { remindAt: snoozedTo, snoozedTo },
    });
  },
};
