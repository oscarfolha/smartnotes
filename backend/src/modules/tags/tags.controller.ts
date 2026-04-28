import { FastifyRequest, FastifyReply } from 'fastify';
import { tagsService, CreateTagSchema } from './tags.service';

export const tagsController = {
  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await tagsService.getAll());
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return reply.send(await tagsService.getById(request.params.id));
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name } = CreateTagSchema.parse(request.body);
    return reply.status(201).send(await tagsService.create(name));
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await tagsService.delete(request.params.id);
    return reply.status(204).send();
  },
};
