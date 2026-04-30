import type { NoteType, Priority } from '../types';

type Translator = (key: any) => string;

export function noteTypeLabel(type: NoteType, t: Translator) {
  const map: Record<NoteType, string> = {
    note: t('noteType_note'),
    reminder: t('noteType_reminder'),
    meeting: t('noteType_meeting'),
    idea: t('noteType_idea'),
  };
  return map[type];
}

export function priorityLabel(priority: Priority, t: Translator) {
  const map: Record<Priority, string> = {
    low: t('priority_low'),
    medium: t('priority_medium'),
    high: t('priority_high'),
  };
  return map[priority];
}

export function activityEventLabel(event: string, t: Translator) {
  const map: Record<string, string> = {
    created: t('activity_created'),
    updated: t('activity_updated'),
    archived: t('activity_archived'),
    restored: t('activity_restored'),
    deleted: t('activity_deleted'),
  };

  return map[event] ?? event;
}
