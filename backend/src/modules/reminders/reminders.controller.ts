import { FastifyRequest, FastifyReply } from 'fastify';
import { remindersService } from './reminders.service';
import { SnoozeReminderSchema } from './reminders.dto';

export const remindersController = {
  async getPending(_request: FastifyRequest, reply: FastifyReply) {
    const reminders = await remindersService.getPending();
    return reply.send(reminders);
  },

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const reminders = await remindersService.getAll();
    return reply.send(reminders);
  },

  async markDone(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const reminder = await remindersService.markDone(request.params.id);
    return reply.send(reminder);
  },

  async snooze(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const dto = SnoozeReminderSchema.parse(request.body);
    const reminder = await remindersService.snooze(request.params.id, dto);
    return reply.send(reminder);
  },
};
