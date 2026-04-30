import { z } from 'zod';

export const NoteTypeEnum = z.enum(['reminder', 'meeting', 'note', 'idea']);
export const PriorityEnum = z.enum(['low', 'medium', 'high']);

export const CreateNoteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  type: NoteTypeEnum.default('note'),
  date: z.string().datetime(),
  priority: PriorityEnum.default('medium'),
  favorite: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  remindAt: z.string().datetime().optional(),
  recurring: z.boolean().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

export const NoteFiltersSchema = z.object({
  type: NoteTypeEnum.optional(),
  priority: PriorityEnum.optional(),
  tagId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(),
});

export const CreateFilterPresetSchema = z.object({
  name: z.string().min(1).max(120),
  search: z.string().optional(),
  type: NoteTypeEnum.optional(),
  priority: PriorityEnum.optional(),
  tagId: z.string().uuid().optional(),
});

export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;
export type NoteFiltersDto = z.infer<typeof NoteFiltersSchema>;
export type CreateFilterPresetDto = z.infer<typeof CreateFilterPresetSchema>;
