import { FastifyInstance } from 'fastify';
import { aiController } from './ai.controller';

export async function aiRoutes(app: FastifyInstance) {
  app.post('/query', aiController.query);
}
