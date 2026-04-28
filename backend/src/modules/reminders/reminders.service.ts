import { remindersRepository } from './reminders.repository';
import { SnoozeReminderDto } from './reminders.dto';

export const remindersService = {
  async getPending() {
    return remindersRepository.findPending();
  },

  async getAll() {
    return remindersRepository.findAll();
  },

  async getById(id: string) {
    const reminder = await remindersRepository.findById(id);
    if (!reminder) throw { statusCode: 404, message: 'Reminder not found' };
    return reminder;
  },

  async markDone(id: string) {
    await remindersService.getById(id);
    return remindersRepository.markDone(id);
  },

  async snooze(id: string, dto: SnoozeReminderDto) {
    await remindersService.getById(id);
    const ms =
      (dto.minutes ?? 0) * 60 * 1000 +
      (dto.hours ?? 0) * 60 * 60 * 1000 +
      (dto.days ?? 0) * 24 * 60 * 60 * 1000;

    if (ms <= 0) throw { statusCode: 400, message: 'At least one of minutes, hours, or days must be provided' };

    const snoozedTo = new Date(Date.now() + ms);
    return remindersRepository.snooze(id, snoozedTo);
  },
};
