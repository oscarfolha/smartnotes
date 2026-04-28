import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { aiService } from './ai.service';
import { notesRepository } from '../notes/notes.repository';

const QuerySchema = z.object({
  question: z.string().min(1).max(1000),
});

export const aiController = {
  async query(request: FastifyRequest, reply: FastifyReply) {
    const { question } = QuerySchema.parse(request.body);

    // Fetch all notes as context
    const notes = await notesRepository.findAll({});
    const context = notes
      .map(
        (n) =>
          `[${n.type.toUpperCase()}] ${n.title} (${new Date(n.date).toLocaleDateString()})\n${n.content}`
      )
      .join('\n\n');

    const answer = await aiService.query(question, context);
    return reply.send({ question, answer });
  },
};
