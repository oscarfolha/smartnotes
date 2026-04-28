import { FastifyInstance } from 'fastify';
import { tagsController } from './tags.controller';

export async function tagsRoutes(app: FastifyInstance) {
  app.get('/', tagsController.getAll);
  app.get('/:id', tagsController.getById);
  app.post('/', tagsController.create);
  app.delete('/:id', tagsController.delete);
}
