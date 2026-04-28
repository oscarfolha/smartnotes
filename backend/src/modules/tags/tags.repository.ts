import prisma from '../../prisma/client';

export const tagsRepository = {
  async findAll() {
    return prisma.tag.findMany({ orderBy: { name: 'asc' } });
  },

  async findById(id: string) {
    return prisma.tag.findUnique({ where: { id }, include: { noteTags: { include: { note: true } } } });
  },

  async create(name: string) {
    return prisma.tag.create({ data: { name } });
  },

  async delete(id: string) {
    return prisma.tag.delete({ where: { id } });
  },
};
