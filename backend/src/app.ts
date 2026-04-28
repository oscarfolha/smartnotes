import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { notesRoutes } from './modules/notes/notes.routes';
import { remindersRoutes } from './modules/reminders/reminders.routes';
import { tagsRoutes } from './modules/tags/tags.routes';
import { aiRoutes } from './modules/ai/ai.routes';
import { errorHandler } from './plugins/errorHandler';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  // Plugins
  app.register(cors, { origin: true });
  app.register(helmet, { contentSecurityPolicy: false });
  app.register(sensible);

  // Error handler
  app.setErrorHandler(errorHandler);

  // Routes
  app.register(notesRoutes, { prefix: '/notes' });
  app.register(remindersRoutes, { prefix: '/reminders' });
  app.register(tagsRoutes, { prefix: '/tags' });
  app.register(aiRoutes, { prefix: '/ai' });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
}
