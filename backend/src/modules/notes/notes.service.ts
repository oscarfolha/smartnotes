import { notesRepository } from './notes.repository';
import { CreateNoteDto, UpdateNoteDto, NoteFiltersDto } from './notes.dto';
import { aiService } from '../ai/ai.service';

const SUMMARY_THRESHOLD = 300; // chars

export const notesService = {
  async getAll(filters: NoteFiltersDto) {
    return notesRepository.findAll(filters);
  },

  async getById(id: string) {
    const note = await notesRepository.findById(id);
    if (!note) throw { statusCode: 404, message: 'Note not found' };
    return note;
  },

  async create(data: CreateNoteDto) {
    const note = await notesRepository.create(data);

    // AI: auto-summarize if content is long
    if (note.content.length > SUMMARY_THRESHOLD) {
      const summary = await aiService.summarize(note.content);
      if (summary) {
        await notesRepository.update(note.id, { summary } as any);
        note.summary = summary;
      }
    }

    // AI: extract structured data for meetings
    if (note.type === 'meeting') {
      const metadata = await aiService.extractMeetingData(note.content);
      if (metadata) {
        await notesRepository.update(note.id, { metadata } as any);
        note.metadata = metadata as any;
      }
    }

    // AI: smart transformation — detect deadlines / responsibilities
    const transform = await aiService.smartTransform(note.content);
    if (transform?.shouldCreateReminder && !note.reminder) {
      // remindAt defaults to tomorrow if not specified
      const remindAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const updatedData: any = { remindAt: remindAt.toISOString() };
      if (transform.priority) updatedData.priority = transform.priority;
      await notesRepository.update(note.id, updatedData);
    }

    return note;
  },

  async update(id: string, data: UpdateNoteDto) {
    await notesService.getById(id); // ensure exists

    const note = await notesRepository.update(id, data);

    // Re-summarize if content changed and is long
    if (data.content && note.content.length > SUMMARY_THRESHOLD) {
      const summary = await aiService.summarize(note.content);
      if (summary) {
        await notesRepository.update(note.id, { summary } as any);
        note.summary = summary;
      }
    }

    // Re-extract meeting data if content changed
    if (data.content && note.type === 'meeting') {
      const metadata = await aiService.extractMeetingData(note.content);
      if (metadata) {
        await notesRepository.update(note.id, { metadata } as any);
        note.metadata = metadata as any;
      }
    }

    return note;
  },

  async delete(id: string) {
    await notesService.getById(id); // ensure exists
    return notesRepository.delete(id);
  },

  async reorderNotes(noteIds: string[]) {
    return notesRepository.reorderNotes(noteIds);
  },

  async archiveNote(id: string) {
    await notesService.getById(id); // ensure exists
    return notesRepository.archive(id);
  },

  async unarchiveNote(id: string) {
    await notesService.getById(id); // ensure exists
    return notesRepository.unarchive(id);
  },

  async getArchived() {
    return notesRepository.findArchived();
  },
};
