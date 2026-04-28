import { FastifyInstance } from 'fastify';
import { remindersController } from './reminders.controller';

export async function remindersRoutes(app: FastifyInstance) {
  app.get('/', remindersController.getAll);
  app.get('/pending', remindersController.getPending);
  app.patch('/:id/done', remindersController.markDone);
  app.patch('/:id/snooze', remindersController.snooze);
}
