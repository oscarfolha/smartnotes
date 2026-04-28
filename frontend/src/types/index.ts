export type NoteType = 'reminder' | 'meeting' | 'note' | 'idea';
export type Priority = 'low' | 'medium' | 'high';

export interface Tag {
  id: string;
  name: string;
}

export interface NoteTag {
  tagId: string;
  noteId: string;
  tag: Tag;
}

export interface Reminder {
  id: string;
  noteId: string;
  remindAt: string;
  recurring: boolean;
  done: boolean;
  snoozedTo?: string;
  note?: Note;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  date: string;
  priority: Priority;
  order: number;
  archived: boolean;
  summary?: string;
  metadata?: MeetingMetadata & { activity?: ActivityEvent[] };
  createdAt: string;
  updatedAt: string;
  noteTags: NoteTag[];
  reminder?: Reminder;
}

export interface ActivityEvent {
  event: string;
  at: string;
}

export interface MeetingMetadata {
  participants: string[];
  decisions: string[];
  action_items: string[];
}

export interface CreateNoteDto {
  title: string;
  content: string;
  type: NoteType;
  date: string;
  priority: Priority;
  tagIds?: string[];
  remindAt?: string;
  recurring?: boolean;
}

export type UpdateNoteDto = Partial<CreateNoteDto>;

export interface NoteFilters {
  type?: NoteType;
  priority?: Priority;
  tagId?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AIQueryResponse {
  question: string;
  answer: string;
}
