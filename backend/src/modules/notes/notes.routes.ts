import { FastifyInstance } from 'fastify';
import { notesController } from './notes.controller';

export async function notesRoutes(app: FastifyInstance) {
  app.get('/', notesController.getAll);
  app.get('/archived', notesController.getArchived);
  app.get('/:id', notesController.getById);
  app.post('/', notesController.create);
  app.post('/reorder', notesController.reorder);
  app.patch('/:id', notesController.update);
  app.patch('/:id/archive', notesController.archive);
  app.patch('/:id/unarchive', notesController.unarchive);
  app.delete('/:id', notesController.delete);
}
