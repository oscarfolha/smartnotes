import { FastifyRequest, FastifyReply } from 'fastify';
import { notesService } from './notes.service';
import { CreateNoteSchema, UpdateNoteSchema, NoteFiltersSchema, CreateFilterPresetSchema } from './notes.dto';

export const notesController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const filters = NoteFiltersSchema.parse(request.query);
    const notes = await notesService.getAll(filters);
    return reply.send(notes);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const note = await notesService.getById(request.params.id);
    return reply.send(note);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateNoteSchema.parse(request.body);
    const note = await notesService.create(data);
    return reply.status(201).send(note);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = UpdateNoteSchema.parse(request.body);
    const note = await notesService.update(request.params.id, data);
    return reply.send(note);
  },

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await notesService.delete(request.params.id);
    return reply.status(204).send();
  },

  async reorder(request: FastifyRequest<{ Body: { noteIds: string[] } }>, reply: FastifyReply) {
    const result = await notesService.reorderNotes(request.body.noteIds);
    return reply.send(result);
  },

  async archive(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const note = await notesService.archiveNote(request.params.id);
    return reply.send(note);
  },

  async unarchive(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const note = await notesService.unarchiveNote(request.params.id);
    return reply.send(note);
  },

  async getArchived(request: FastifyRequest, reply: FastifyReply) {
    const notes = await notesService.getArchived();
    return reply.send(notes);
  },

  async getFilterPresets(request: FastifyRequest, reply: FastifyReply) {
    const presets = await notesService.getFilterPresets();
    return reply.send(presets);
  },

  async createFilterPreset(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateFilterPresetSchema.parse(request.body);
    const preset = await notesService.createFilterPreset(data);
    return reply.status(201).send(preset);
  },

  async deleteFilterPreset(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await notesService.deleteFilterPreset(request.params.id);
    return reply.status(204).send();
  },
};
