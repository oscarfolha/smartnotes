import { tagsRepository } from './tags.repository';
import { z } from 'zod';

export const CreateTagSchema = z.object({ name: z.string().min(1).max(50) });

export const tagsService = {
  async getAll() {
    return tagsRepository.findAll();
  },

  async getById(id: string) {
    const tag = await tagsRepository.findById(id);
    if (!tag) throw { statusCode: 404, message: 'Tag not found' };
    return tag;
  },

  async create(name: string) {
    return tagsRepository.create(name.toLowerCase().trim());
  },

  async delete(id: string) {
    await tagsService.getById(id);
    return tagsRepository.delete(id);
  },
};
