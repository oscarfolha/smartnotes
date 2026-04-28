import { z } from 'zod';

export const SnoozeReminderSchema = z.object({
  minutes: z.number().int().min(1).optional(),
  hours: z.number().int().min(1).optional(),
  days: z.number().int().min(1).optional(),
});

export type SnoozeReminderDto = z.infer<typeof SnoozeReminderSchema>;
