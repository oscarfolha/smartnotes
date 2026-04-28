---
name: backend-patterns
description: "Use when: adding API endpoints, database queries, services, or debugging backend issues. Covers Fastify routing, Prisma ORM, controller-service-repository patterns, and API conventions"
applyTo: "backend/src/**/*.ts"
---

# Backend Patterns & Guidelines

## Project Structure

```
backend/src/
├── modules/
│   ├── notes/
│   │   ├── notes.controller.ts    # Request handlers (routes)
│   │   ├── notes.service.ts       # Business logic (AI features, validation)
│   │   └── notes.repository.ts    # Database queries (Prisma)
│   ├── reminders/
│   │   ├── reminders.controller.ts
│   │   ├── reminders.service.ts
│   │   └── reminders.repository.ts
│   ├── tags/
│   ├── ai/
│   └── auth/
└── main.ts                        # Server setup & route registration
```

## Fastify Server Setup

### Main.ts Pattern
```typescript
import Fastify from 'fastify';
import { notesRouter } from './modules/notes/notes.controller';
import { remindersRouter } from './modules/reminders/reminders.controller';

const app = Fastify();

// Register routes
app.register(notesRouter, { prefix: '/api/notes' });
app.register(remindersRouter, { prefix: '/api/reminders' });

app.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
```

## Controller Pattern (Route Handlers)

### Notes Controller
```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NotesService } from './notes.service';

const service = new NotesService();

export async function notesRouter(fastify: FastifyInstance) {
  // GET /api/notes
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const notes = await service.getAllNotes();
      return reply.code(200).send({ data: notes, error: null });
    } catch (error) {
      return reply.code(500).send({
        data: null,
        error: { message: (error as Error).message, code: 'INTERNAL_SERVER_ERROR' },
      });
    }
  });

  // POST /api/notes
  fastify.post('/', async (request: FastifyRequest<{ Body: CreateNoteRequest }>, reply: FastifyReply) => {
    try {
      const note = await service.createNote(request.body);
      return reply.code(201).send({ data: note, error: null });
    } catch (error) {
      return reply.code(400).send({
        data: null,
        error: { message: (error as Error).message, code: 'BAD_REQUEST' },
      });
    }
  });

  // PATCH /api/notes/:id
  fastify.patch('/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: UpdateNoteRequest }>, reply: FastifyReply) => {
    try {
      const note = await service.updateNote(request.params.id, request.body);
      return reply.code(200).send({ data: note, error: null });
    } catch (error) {
      return reply.code(400).send({
        data: null,
        error: { message: (error as Error).message, code: 'BAD_REQUEST' },
      });
    }
  });

  // DELETE /api/notes/:id
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      await service.deleteNote(request.params.id);
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({
        data: null,
        error: { message: (error as Error).message, code: 'DELETE_FAILED' },
      });
    }
  });
}
```

## Service Pattern (Business Logic)

### Notes Service
```typescript
import { NotesRepository } from './notes.repository';
import z from 'zod';

const CreateNoteSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['note', 'reminder']).default('note'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;

export class NotesService {
  private repo = new NotesRepository();

  async getAllNotes() {
    return await this.repo.findAll();
  }

  async createNote(data: CreateNoteRequest) {
    // Validate input
    const validated = CreateNoteSchema.parse(data);

    // Create note
    const note = await this.repo.create(validated);

    // If type is 'reminder', auto-create persistent reminder record
    if (validated.type === 'reminder') {
      await this.repo.createReminder(note.id);
    }

    return note;
  }

  async updateNote(id: string, data: Partial<CreateNoteRequest>) {
    const note = await this.repo.findById(id);
    if (!note) throw new Error('Note not found');

    // If changing FROM reminder type, delete reminder record
    if (note.type === 'reminder' && data.type !== 'reminder') {
      await this.repo.deleteReminder(id);
    }

    // If changing TO reminder type, create reminder record
    if (note.type !== 'reminder' && data.type === 'reminder') {
      await this.repo.createReminder(id);
    }

    return await this.repo.update(id, data);
  }

  async deleteNote(id: string) {
    const note = await this.repo.findById(id);
    if (!note) throw new Error('Note not found');

    // Cascade: delete reminder if exists
    if (note.type === 'reminder') {
      await this.repo.deleteReminder(id);
    }

    return await this.repo.delete(id);
  }
}
```

## Repository Pattern (Database Queries)

### Notes Repository
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export class NotesRepository {
  // Find all notes for user
  async findAll() {
    return await prisma.note.findMany({
      include: {
        tags: true,
        reminders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find note by ID
  async findById(id: string) {
    return await prisma.note.findUnique({
      where: { id },
      include: { tags: true, reminders: true },
    });
  }

  // Create note
  async create(data: any) {
    return await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        date: data.date ? new Date(data.date) : null,
        done: false,
      },
      include: { tags: true },
    });
  }

  // Update note
  async update(id: string, data: any) {
    return await prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        date: data.date ? new Date(data.date) : null,
        done: data.done,
      },
      include: { tags: true, reminders: true },
    });
  }

  // Delete note
  async delete(id: string) {
    return await prisma.note.delete({ where: { id } });
  }

  // Create persistent reminder
  async createReminder(noteId: string) {
    return await prisma.reminder.create({
      data: {
        noteId,
        createdAt: new Date(),
      },
    });
  }

  // Delete persistent reminder
  async deleteReminder(noteId: string) {
    return await prisma.reminder.deleteMany({
      where: { noteId },
    });
  }
}
```

### Reminders Repository (Persistent Notifications)
```typescript
export class RemindersRepository {
  // Find all pending reminders (persistent, not time-based)
  async findPending() {
    return await prisma.note.findMany({
      where: {
        type: 'reminder',
        done: false,
      },
      include: {
        reminders: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark reminder as done
  async markDone(noteId: string) {
    return await prisma.note.update({
      where: { id: noteId },
      data: { done: true },
      include: { reminders: true },
    });
  }
}
```

## Prisma Schema Patterns

### Note Schema
```prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  description String?
  type      String  @default("note") // "note" | "reminder"
  priority  String  @default("medium") // "low" | "medium" | "high"
  date      DateTime?
  done      Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tags      Tag[]
  reminders Reminder[]

  @@map("notes")
}

model Reminder {
  id        String   @id @default(cuid())
  noteId    String   @unique
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("reminders")
}

model Tag {
  id        String   @id @default(cuid())
  name      String
  notes     Note[]
  createdAt DateTime @default(now())

  @@unique([name])
  @@map("tags")
}
```

## API Response Format

### Success Response
```typescript
{
  "data": { /* resource */ },
  "error": null
}
```

### Error Response
```typescript
{
  "data": null,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

## Error Codes and HTTP Status

| Scenario | Status | Code |
|----------|--------|------|
| Valid request, resource returned | 200 | OK |
| Resource created | 201 | CREATED |
| Resource deleted | 204 | NO_CONTENT |
| Bad input, validation failed | 400 | BAD_REQUEST |
| Not found | 404 | NOT_FOUND |
| Server error | 500 | INTERNAL_SERVER_ERROR |

## Reminder Logic Rules

**Important reminder semantics:**
1. Reminder-type notes are **always** persistent on dashboard
2. Query uses `where { type: 'reminder', done: false }` (NOT time-based like remindAt)
3. Marking note as `done: true` removes it from pending reminders
4. Changing note `type` from "reminder" to "note" deletes the reminder record
5. Deleting a note cascades deletion of its reminder record

## Testing Database Changes

### Run Migrations
```bash
cd backend
npx prisma migrate dev --name describe_migration
```

### Seed Database
```bash
npx prisma db seed
```

### Validate Schema
```bash
npx prisma validate
```

## TypeScript Compilation

### Check for Errors
```bash
npm run tsc -- --noEmit
```

### Common TS Issues
- ❌ `noteData.type !== 'reminder'` when `type: Enum` — Use type narrowing or adjust condition
- ✅ Validate data types match Prisma schema before queries
- ✅ Always include `include` to fetch related records (tags, reminders)

## Debugging Tips

1. **Database query not returning expected data:** Check `include` for related records
2. **Type error on Prisma query:** Verify schema field names and types match data object
3. **Build fails:** Run `npm run build` and check TypeScript errors
4. **Reminders not appearing:** Verify `type = 'reminder'` AND `done = false` in query
5. **Cascade delete not working:** Ensure Prisma schema has `onDelete: Cascade` in relations

## Common Mistakes to Avoid

1. **Forgetting to return new data after DB updates**
   - ❌ `await prisma.note.update(...)`; return null;`
   - ✅ `return await prisma.note.update(...);`

2. **Not including related records in queries**
   - ❌ `await prisma.note.findMany()`
   - ✅ `await prisma.note.findMany({ include: { tags: true } })`

3. **Comparing enum fields with string literals**
   - ❌ `note.type !== 'reminder'` (type is Enum, may cause TS error)
   - ✅ Use Prisma's typed enums or adjust comparisons

4. **Missing error handling in routes**
   - ❌ Routes that don't catch exceptions return 500
   - ✅ Wrap business logic in try-catch, return proper error responses

5. **Mutations in repository functions**
   - ❌ Direct object modifications
   - ✅ Use Prisma methods (create, update, delete) for DB persistence

## Controller Route Checklist

When adding a new route, ensure:
- [ ] Proper HTTP method (GET, POST, PATCH, DELETE)
- [ ] TypeScript types for request/response
- [ ] Try-catch block for error handling
- [ ] Correct status codes (200, 201, 204, 400, 500)
- [ ] Response follows format: `{ data, error }`
- [ ] Input validation (Zod schema in service)
- [ ] Documentation comment above route
