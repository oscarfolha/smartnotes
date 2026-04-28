---
name: notesApp-workspace
description: "Use when: working on notesApp full-stack notes application. Provides project structure, tech stack, and conventions for note management, archiving, drag-and-drop reordering, reminders, calendar integration, and AI features"
---

# NotesApp Workspace Context

## Project Overview

**NotesApp** (formerly "Smart Notes AI") is a full-stack note-taking application with persistent reminders, archiving, drag-and-drop reordering, calendar integration, and AI-powered features. Built with React 19 + Fastify + PostgreSQL.

**Key User Journeys:**
- Create/edit/delete notes with tags, priority levels, and reminder scheduling
- Drag-and-drop note reordering on dashboard (persisted to database)
- Archive completed notes; restore from archive page
- View calendar with note history, click to create notes with prefilled dates
- Persistent reminder notifications that display on dashboard until marked done
- AI chat box for note enhancement and suggestions

## Recent Updates (April 29, 2026)

### ✅ New Testing Baseline (Tests-First)
1. **Frontend Unit Tests:** Added Vitest + Testing Library setup and suites for preferences context, notes service, command palette, and reminder popup digest behavior.
2. **Backend Unit Tests:** Added Vitest configuration and suites for notes service and notes repository reorder behavior.
3. **Validation Workflow:** Frontend and backend test/build commands now pass after latest updates.

### ✅ Productivity + UX Additions
1. **Bulk Actions:** Notes and Archive pages support multi-select operations (bulk archive, bulk restore, bulk delete).
2. **Filter Presets:** Notes page supports saving/loading/removing filter presets from localStorage.
3. **Undo for Destructive Actions:** Added delayed delete/archive flows with Snackbar-based undo.
4. **Command Palette:** Added global keyboard command palette (Ctrl/Cmd+K) for quick actions.
5. **Reminder Digest UI:** Reminder popup can show grouped pending reminders with per-item actions.
6. **Tooltips:** Archive/delete actions now expose tooltip guidance.

### ✅ Backend Data Layer Improvements
1. **Reorder Performance:** `reorderNotes` uses a single raw SQL `UPDATE ... CASE` query instead of N update operations.
2. **Activity Timeline Metadata:** Notes metadata now appends activity events (`created`, `updated`, `archived`, `restored`, `deleted`) for timeline rendering.

### ✅ i18n and Theming Expansion
1. Added/expanded translation keys used by new bulk actions, presets, undo states, AI box text, and command palette strings.
2. Improved reminder presentation in dark mode contexts.

### ✅ Completed Features
1. **Drag-and-Drop Persistence:** Added `order` field to Note model; drag-and-drop on Dashboard now saves order to database via `POST /notes/reorder`
2. **Archive Functionality:** Added `archived` field to Note model; notes can be sent to Archive page; restore from archive
3. **UI Improvements:**
   - Repositioned NEW NOTE button to floating action button (FAB) at bottom-right
   - Fixed MUI TextField floating label overlap issue with proper `variant`, `margin`, and `InputLabelProps`
4. **App Rebranding:** Removed "AI" from app name ("Smart Notes AI" → "Smart Notes")
5. **Archive Page:** New dedicated archive page with restore/delete controls
6. **NoteCard Archive Button:** Added archive icon button next to delete
7. **Archive Delete Action:** Archived notes can now be permanently deleted from Archive page
8. **Preferences:** Added dark mode toggle and language selector (English, Portuguese, Spanish)
9. **Create Date Behavior:** New note actions outside calendar explicitly default to current date/time

###⚠️ Pending Database Migration
**IMPORTANT:** You must run Prisma migration to apply schema changes:
```bash
cd backend
npx prisma migrate dev --name add_order_and_archived_fields
```
This will:
- Add `order: Int` field to Note (default 0)
- Add `archived: Boolean` field to Note (default false)
- Regenerate Prisma client with new types
- **No data loss** — existing notes preserved with default values

### Reminders Status
- Backend logic in place: persistent reminders query `where { type: 'reminder', done: false }`
- Frontend hooks prepared: `useRemindersStore`, `usePendingReminders()`
- **API endpoints ready:** `GET /reminders/pending`, `PATCH /reminders/:id/done`, `PATCH /reminders/:id/snooze`
- **Note:** Reminders will work correctly after Prisma migration runs

## Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **UI Library:** MUI (Material-Design) + Emotion CSS-in-JS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Calendar:** react-big-calendar
- **Drag & Drop:** HTML5 native API with database persistence

### Backend
- **Runtime:** Node.js
- **Framework:** Fastify + TypeScript
- **ORM:** Prisma 7 with PrismaPg adapter
- **Database:** PostgreSQL

### Build & Deployment
- **Frontend Build:** Vite (esbuild/rolldown)
- **Backend:** TypeScript (tsc)
- **Package Manager:** npm

## Directory Structure

```
notesApp/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Today's notes, drag-and-drop, FAB button
│   │   │   ├── CalendarPage.tsx    # Monthly calendar view
│   │   │   ├── NotesPage.tsx       # Full notes list with filters
│   │   │   ├── ArchivePage.tsx     # Archived notes with restore button
│   │   │   └── SettingsPage.tsx    # User preferences
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.tsx      # MUI AppBar navigation (Dashboard, Calendar, Notes, Archive)
│   │   │   ├── notes/
│   │   │   │   ├── NoteCard.tsx    # MUI Card with archive + delete buttons, drag handle
│   │   │   │   └── NoteModal.tsx   # MUI Dialog for create/edit (fixed floating labels)
│   │   │   ├── reminders/
│   │   │   │   └── ReminderPopup.tsx # MUI Dialog for persistent notifications
│   │   │   ├── tags/
│   │   │   │   └── TagSelector.tsx # Tag picker component
│   │   │   └── ai/
│   │   │       └── AIChatBox.tsx   # AI suggestions widget
│   │   ├── store/
│   │   │   └── notes.store.ts      # Zustand: notes, modal state, initialDate
│   │   ├── hooks/
│   │   │   └── useNotes.ts         # includes useReorderNotes, useArchiveNote, useUnarchiveNote
│   │   └── App.tsx                 # Root with all routes (Dashboard, Calendar, Notes, Archive)
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── notes/
│   │   │   │   ├── notes.controller.ts  # includes POST /reorder, PATCH /:id/archive routes
│   │   │   │   ├── notes.service.ts     # includes reorderNotes, archiveNote methods
│   │   │   │   └── notes.repository.ts  # DB queries for order + archive features
│   │   │   ├── reminders/
│   │   │   │   ├── reminders.controller.ts
│   │   │   │   ├── reminders.service.ts
│   │   │   │   └── reminders.repository.ts
│   │   │   ├── tags/
│   │   │   ├── ai/
│   │   │   └── auth/
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # ORM definitions (order, archived fields added)
│   │   │   └── migrations/
│   │   └── main.ts
│   └── tsconfig.json
├── .github/
│   └── instructions/               # Context files updated
└── README.md, package.json, etc.
```

## Schema Updates (Pending Migration)

### Note Model Changes
```prisma
model Note {
  id        String    @id @default(uuid())
  title     String
  content   String
  type      NoteType  @default(note)
  date      DateTime
  priority  Priority  @default(medium)
  order     Int       @default(0)      // ← NEW: for drag-and-drop ordering
  archived  Boolean   @default(false)  // ← NEW: for archive feature
  summary   String?
  metadata  Json?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  reminder  Reminder?
  noteTags  NoteTag[]
}
```

## API Endpoints Added

### Notes
- `POST /notes/reorder` — Save reordered note IDs: `{ noteIds: string[] }`
- `PATCH /notes/:id/archive` — Archive a note
- `PATCH /notes/:id/unarchive` — Restore from archive
- `GET /notes/archived` — Fetch all archived notes

### Reminders (Existing, now persistent)
- `GET /reminders/pending` — Fetch reminders with `type='reminder'` and `done=false`
- `PATCH /reminders/:id/done` — Mark reminder as done
- `PATCH /reminders/:id/snooze` — Snooze reminder by minutes/hours/days

## Key Changes from Previous Version

| Feature | Before | After |
|---------|--------|-------|
| **Drag-and-Drop** | UI state only | Persisted to DB via `order` field |
| **NEW NOTE Button** | Top-right corner | Floating Action Button (FAB) |
| **Reminders** | Time-scheduled with snooze | Persistent until marked done or type changed |
| **Completed Notes** | No archive feature | Archive page with restore button |
| **App Name** | "Smart Notes AI" | "Smart Notes" |
| **TextField Labels** | Overlapped text | Properly configured with `variant` + `margin` |

## Known Limitations & Planned Enhancements

1. **Database Migration Required:** Run `npx prisma migrate dev --name add_order_and_archived_fields` before starting dev servers
2. **Reminders Notifications:** Will appear after migration (API endpoints ready, awaiting database schema)
3. **Archive Performance:** Consider adding indexes on `archived` and `type` fields for large note sets
4. **Drag-and-Drop Recovery:** Order resets on browser refresh until mutation completes; add optimistic updates for faster UX

## Team Practices

- **Before committing:** Run both frontend and backend builds to catch TypeScript errors early
- **Database changes:** Always run migrations in development before deploying
- **Code review focus:** MUI component consistency, Zustand patterns, Prisma query efficiency
- **New features:** Ensure archived notes are excluded from main views (add `archived: false` to queries)
- **Testing:** Verify drag-and-drop persistence, archive restoration, and reminder notifications work end-to-end

---

**Last Updated:** April 28, 2026  
**Context Version:** 2.0 (Drag-and-Drop Persistence, Archiving, UI Fixes)
**Migration Status:** ⚠️ Pending — Run migration before development

│   │   │   └── SettingsPage.tsx    # User preferences
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Navbar.tsx      # MUI AppBar navigation
│   │   │   ├── notes/
│   │   │   │   ├── NoteCard.tsx    # MUI Card with delete dialog, drag handle
│   │   │   │   └── NoteModal.tsx   # MUI Dialog for create/edit (conditional fields)
│   │   │   ├── reminders/
│   │   │   │   └── ReminderPopup.tsx # MUI Dialog for persistent notifications
│   │   │   ├── tags/
│   │   │   │   └── TagSelector.tsx # Tag picker component
│   │   │   └── ai/
│   │   │       └── AIChatBox.tsx   # AI suggestions widget
│   │   ├── store/
│   │   │   └── notes.store.ts      # Zustand: notes, modal state, initialDate
│   │   ├── hooks/
│   │   │   └── (custom React hooks)
│   │   └── App.tsx                 # Root with MUI ThemeProvider, full-height layout
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── notes/
│   │   │   │   ├── notes.controller.ts
│   │   │   │   ├── notes.service.ts
│   │   │   │   └── notes.repository.ts
│   │   │   ├── reminders/
│   │   │   │   ├── reminders.controller.ts
│   │   │   │   ├── reminders.service.ts
│   │   │   │   └── reminders.repository.ts
│   │   │   ├── tags/
│   │   │   ├── ai/
│   │   │   └── auth/
│   │   ├── prisma/
│   │   │   └── schema.prisma       # ORM definitions
│   │   └── main.ts
│   └── tsconfig.json
├── .github/
│   └── instructions/               # This context folder
└── README.md, package.json, etc.
```

## Recent Changes & Current State

### MUI Migration (Latest)
- **Completed:** All major pages and components migrated from Tailwind to Material-UI
- **Components migrated:** App shell, Navbar, Dashboard, CalendarPage, NotesPage, NoteCard, NoteModal, ReminderPopup
- **Remaining Tailwind:** TagSelector, AIChatBox (functional but not yet migrated)
- **MUI Patterns:** Use `sx` prop for styling, ThemeProvider in App root, CssBaseline for reset

### Reminder Behavior Overhaul
- **Old Model:** Reminders were time-scheduled (remindAt field), snooze-based
- **New Model:** Reminder-type notes show as persistent notifications on dashboard until:
  - User marks the reminder as done (status change)
  - User deletes the note
  - User changes note type away from 'reminder'
- **Backend Logic:** `reminders.repository.findPending()` now queries `where { done: false, note.type: 'reminder' }` instead of time-based filtering
- **Frontend Logic:** ReminderPopup is simplified—no snooze; supports "Open Note", "Dismiss", or "Mark Done"
- **Dismiss Behavior:** Dismiss hides the current reminder from popup for the current app session; unresolved reminders can reappear in future sessions

### Dashboard Drag-and-Drop
- **Implementation:** HTML5 native drag API (not DnD library)
- **State:** Persisted to database via `POST /notes/reorder` and Note `order` field
- **UX:** Drag handle visible on NoteCard, visual feedback on drag
- **Date Scope Selector:** Dashboard includes a user dropdown (`week` default, `month`, `year`) and displays notes for the selected period

### Calendar Date Prefill
- **Behavior:** Clicking a calendar date opens the note creation modal with that date prefilled in the date field
- **Implementation:** CalendarPage passes `initialDate` to store's `openModal({ initialDate: "ISO-string" })`
- **Store Shape:** `initialDate` field in Zustand, passed to NoteModal component
- **Create Outside Calendar:** Dashboard/Notes/Archive/Calendar top actions open modal with current date by default

### Preferences & Localization
- **Theme:** Light and dark mode supported via app preferences context and MUI theme mode
- **Language:** UI supports English (`en`), Portuguese (`pt`), and Spanish (`es`)
- **Persistence:** Theme/language stored in `localStorage`; dashboard period stored in `sessionStorage`

### Delete Confirmation
- **Old Model:** Browser's `window.confirm()` dialog
- **New Model:** MUI Dialog with "Cancel" and "Confirm Delete" buttons
- **Implementation:** NoteCard triggers delete confirmation; if confirmed, calls delete API

### Floating Action Button Placement
- **Rule:** Keep note FAB separated from AI chat toggle to avoid overlap
- **Current Positioning:** Note FAB uses additional right offset (`right >= 88px`) on pages where chatbot toggle is present

## Key Conventions

### Component Structure
- **Pages** (in `/pages`) handle route-level logic, fetch data via React Query
- **Components** (in `/components`) are composable, reusable UI units with MUI
- **Zustand Store** (`notes.store.ts`) holds: notes array, selectedNoteId, isModalOpen, initialDate
- **No Props Drilling:** Use store for cross-component state (modal state, selected note, initial form values)

### Naming
- **Components:** PascalCase (`NoteCard.tsx`, `NoteModal.tsx`, `Dashboard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useNotes`, `useNotesQuery`, etc.)
- **Store Methods:** camelCase (`addNote`, `openModal`, `closeModal`, `deleteNote`)
- **API Endpoints:** RESTful (`GET /notes`, `POST /notes`, `PATCH /notes/:id`, `DELETE /notes/:id`)

### API Response Format
```typescript
// Success
{ data: T, error: null }

// Error
{ data: null, error: { message: string, code: string } }
```

### Database Notes
- **Note Types:** "note" (default), "reminder" (persistent notification), others as needed
- **Reminder Status:** Use `done: boolean` field, combined with `type: "reminder"` to determine if showing
- **Tags:** Many-to-many relationship with Note; TagSelector component handles UI
- **Dates:** Use ISO strings (`.toISOString()`) throughout; backend converts as needed

### MUI Component Usage
- **Forms:** Use `TextField`, `Select`, `Checkbox` with `react-hook-form` integration
- **Layout:** Grid with `size` prop (not `xs`/`sm`/`md`); Container for max-width
- **Dialogs:** MUI `Dialog` for modals; use `size` or `sx={{ width: '400px' }}` for constraining
- **Lists:** MUI `List`, `ListItem`, `ListItemButton` for scrollable content
- **Icons:** Import from `@mui/icons-material` (e.g., `DeleteIcon`, `AddIcon`, `DragIndicatorIcon`)
- **Chips:** For tags, priorities, and status indicators

### MUI Icon Gotchas
- ❌ `DeleteOutlineIcon` — Use `DeleteIcon` instead (not exported in v5)
- ✅ Common icons: `AddIcon`, `EditIcon`, `DeleteIcon`, `DragIndicatorIcon`, `CheckIcon`, `MoreVertIcon`

### Styling Patterns
```typescript
// Preferred: MUI sx prop
<Box sx={{ display: 'flex', gap: 2, p: 2 }}>

// Theme spacing: theme.spacing(1) = 8px, theme.spacing(2) = 16px, etc.
// Common values: p={1}, m={2}, gap={1.5}, pt={3}

// Responsive: sx={{ width: { xs: '100%', sm: '400px' } }}
```

## Common Tasks

### Adding a New Page
1. Create `frontend/src/pages/NewPage.tsx` with MUI Layout
2. Wire route in App router
3. Add Navbar link if needed
4. Connect to Zustand store if state sharing needed

### Adding a Note Field
1. Update Prisma schema (`backend/prisma/schema.prisma`): add field to Note model
2. Run `npx prisma migrate dev --name add_field_name`
3. Update backend API (notes.service, notes.repository)
4. Update NoteModal form in frontend (add TextField, Zod schema)
5. Update note.store.ts types if needed

### Running Development Servers
```bash
# Frontend (http://localhost:5173)
cd frontend && npm run dev

# Backend (http://localhost:3001)
cd backend && npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## Known Issues & Workarounds

1. **Chunk Size Warning in Vite Build:** Non-blocking warning about JS chunks >500KB. Can be resolved with code-splitting, but not critical for MVP.

2. **Drag-and-Drop State:** Reorder is client-side only. DB doesn't persist sort order. If you need persistence, add `order: Int` field to Note schema and POST reorder endpoint.

3. **Reminder Modal Fields:** NoteModal hides unnecessary fields (date, priority) when `noteType === 'reminder'`. This is intentional for simplified UX.

4. **Local Calendar Events:** react-big-calendar events are read-only from state; editing events requires modal navigation.

## Team Practices

- **Before committing:** Run `npm run build` in both frontend and backend
- **Code review focus:** MUI component consistency, Zustand store updates, Prisma schema migrations
- **When adding features:** Ensure MUI is used for new UI, not Tailwind
- **Reminder semantics:** Always treat reminder-type notes as persistent; use done flag for lifecycle

---

**Last Updated:** April 28, 2026  
**Context Version:** 1.0 (Full MUI Migration, Persistent Reminders)
