import { PrismaClient, NoteType, Priority } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/smart_notes_ai';

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up
  await prisma.noteTag.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.note.deleteMany();
  await prisma.tag.deleteMany();

  // Tags
  const tagWork = await prisma.tag.create({ data: { name: 'work' } });
  const tagPersonal = await prisma.tag.create({ data: { name: 'personal' } });
  const tagUrgent = await prisma.tag.create({ data: { name: 'urgent' } });

  const now = new Date();

  // Note 1: meeting
  const meeting = await prisma.note.create({
    data: {
      title: 'Q2 Planning Meeting',
      content:
        'Participants: Alice, Bob, Carol. Decisions: Launch in June. Action items: Alice to prepare deck, Bob to finalize budget.',
      type: NoteType.meeting,
      date: now,
      priority: Priority.high,
      metadata: {
        participants: ['Alice', 'Bob', 'Carol'],
        decisions: ['Launch in June'],
        action_items: ['Alice to prepare deck', 'Bob to finalize budget'],
      },
      noteTags: { create: [{ tagId: tagWork.id }] },
    },
  });

  // Note 2: reminder with Reminder record
  const reminderNote = await prisma.note.create({
    data: {
      title: 'Submit expense report',
      content: 'Submit Q1 expense report before end of week.',
      type: NoteType.reminder,
      date: now,
      priority: Priority.high,
      noteTags: { create: [{ tagId: tagWork.id }, { tagId: tagUrgent.id }] },
      reminder: {
        create: {
          remindAt: new Date(Date.now() - 60 * 1000), // 1 min ago — triggers on load
          recurring: false,
          done: false,
        },
      },
    },
  });

  // Note 3: idea
  await prisma.note.create({
    data: {
      title: 'App feature idea: dark mode',
      content: 'Would be great to ship dark mode before summer.',
      type: NoteType.idea,
      date: now,
      priority: Priority.low,
      noteTags: { create: [{ tagId: tagPersonal.id }] },
    },
  });

  // Note 4: generic note
  await prisma.note.create({
    data: {
      title: 'Books to read',
      content: 'Atomic Habits, Deep Work, The Pragmatic Programmer.',
      type: NoteType.note,
      date: now,
      priority: Priority.low,
      noteTags: { create: [{ tagId: tagPersonal.id }] },
    },
  });

  console.log('✅ Seed complete');
  console.log({ meeting, reminderNote });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
