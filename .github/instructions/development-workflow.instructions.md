---
name: development-workflow
description: "Use when: debugging build issues, setting up dev environment, running tests, or need quick reference for project setup and common commands"
---

# Development Workflow & Troubleshooting

## Quick Start

### Initial Setup
```bash
# Install dependencies (both frontend and backend)
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
# backend/.env should have DATABASE_URL pointing to PostgreSQL
# frontend/.env (optional) for API_URL if needed
```

### Running Development Servers

**Terminal 1 - Frontend (React Dev Server)**
```bash
cd frontend
npm run dev
# Opens http://localhost:5173 with hot reload
```

**Terminal 2 - Backend (Fastify Server)**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
# Watch mode enabled for TypeScript changes
```

### Production Build

**Frontend Build**
```bash
cd frontend
npm run build
# Output: dist/ folder ready for deployment
```

**Backend Build**
```bash
cd backend
npm run build
# Output: dist/ folder with compiled js
```

## Database Setup

### Initialize PostgreSQL Database
```bash
# Ensure PostgreSQL is running
# Create a database (e.g., notesapp_dev)

# Inside backend folder:
npx prisma migrate dev --name init
# Runs schema.prisma migrations and generates PrismaClient
```

### Seed Tutorial Data (Optional)
```bash
npx prisma db seed
# Runs prisma/seed.ts if it exists
```

### Reset Database (⚠️ Destructive)
```bash
npx prisma migrate reset
# Drops all data and re-runs migrations
```

## TypeScript Validation

### Check for Errors (No Build)
```bash
# Frontend
cd frontend && npm run tsc -- --noEmit

# Backend
cd backend && npm run tsc -- --noEmit

# Both (if scripts are set up)
npm run type-check # from workspace root
```

### Build with Type-Check
```bash
cd frontend && npm run build    # includes tsc
cd backend && npm run build     # includes tsc
```

## Common Build Issues & Solutions

### Issue: "Cannot find module '@mui/material'"
**Cause:** MUI dependencies not installed
```bash
cd frontend
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### Issue: "DeleteOutlineIcon not found"
**Cause:** Icon doesn't exist in MUI v5
**Fix:** Replace with `DeleteIcon`
```typescript
// ❌ Wrong
import { DeleteOutlineIcon } from '@mui/icons-material';

// ✅ Correct
import { DeleteIcon } from '@mui/icons-material';
```

### Issue: Vite chunk size warning
**Output:** "Entry point is large (846 kB gzip)"
**Impact:** Non-blocking warning, app runs fine
**Fix (optional):** Implement code-splitting or dynamic imports (not critical for MVP)

### Issue: Frontend "Cannot GET /api/notes"
**Cause:** Backend not running or wrong URL
**Fix:**
```bash
# Ensure backend is running on :3001
cd backend && npm run dev

# Check fetch URL in frontend matches backend port
// Should be http://localhost:3001/api/notes
```

### Issue: "DATABASE_URL not found"
**Cause:** `.env` file missing or not loaded
**Fix:**
```bash
cd backend
echo "DATABASE_URL=postgresql://user:password@localhost:5432/notesapp_dev" > .env
# Test connection
npx prisma validate
```

### Issue: TypeScript error "TS2367: This comparison appears to be unintentional"
**Cause:** Comparing Enum field with string literal
**Example:** `if (note.type !== 'reminder')` where type is Prisma Enum
**Fix:** Use Prisma's typed enums or adjust the comparison

```typescript
// ❌ May cause TS error
if (note.type !== 'reminder') { }

// ✅ Correct
if (noteData.type === 'note') { }
// Or check the exact condition without redundant comparison
```

### Issue: "Prisma PrismaClient is not defined"
**Cause:** PrismaClient not initialized or wrong adapter
**Fix:** Ensure `PrismaPg` adapter is used in backend/src/modules/*/repository.ts
```typescript
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

## Hot Reload & Development

### Frontend Hot Reload
- Vite automatically reloads on `.tsx` or `.ts` changes
- State in Zustand store persists across reloads (unless cleared)
- React Fast Refresh preserves component state when possible

### Backend Hot Reload
- TypeScript watcher compiles on `.ts` changes (`npm run dev`)
- Fastify server may need restart if routes change
- To restart: Press Ctrl+C and run `npm run dev` again

### Debugging Frontend
```bash
# Open DevTools in browser
F12 or Ctrl+Shift+I

# Check React Query cache
# Use React Query DevTools browser extension
# Check Zustand store in console
window.localStorage  # (if persisted)
```

### Debugging Backend
```bash
# Node Inspector (Chrome DevTools)
node --inspect-brk node_modules/.bin/tsc
# Then open chrome://inspect in Chrome

# Or use VS Code debugger: Set breakpoints and press F5
```

## Dependency Management

### Add a Package
```bash
# Frontend
cd frontend && npm install package-name

# Backend
cd backend && npm install package-name
```

### Update Dependencies
```bash
# Check for outdated
npm outdated

# Update all
npm update

# Update specific
npm update package-name@latest
```

### Remove Unused Dependencies
```bash
npm prune
```

## Testing Checklist

Before committing, verify:

- [ ] `npm run build` succeeds in frontend (no TS errors, chunks created)
- [ ] `npm run build` succeeds in backend (no TS errors)
- [ ] `npm run dev` starts both servers without crashing
- [ ] Frontend loads at http://localhost:5173
- [ ] API responds at http://localhost:3001/api/notes
- [ ] DevTools console has no errors
- [ ] Can create/edit/delete notes
- [ ] Can drag notes on dashboard
- [ ] Can click delete button and see MUI dialog
- [ ] Can click calendar date and see modal with prefilled date
- [ ] Reminders appear on dashboard and can be dismissed for current session
- [ ] Marking reminder done removes it from pending reminders

## MUI Build Errors Reference

| Error | Fix |
|-------|-----|
| Icon not exported (e.g., DeleteOutlineIcon) | Use `DeleteIcon` instead; check @mui/icons-material exports |
| `sx` prop not recognized | Ensure component is from @mui/material, not native HTML |
| Theme color 'primary' missing | Check `<ThemeProvider>` wraps `<CssBaseline />` in App.tsx |
| Grid size not working (`xs`, `sm`, `md`) | Use `size` prop instead: `size={{ xs: 12, sm: 6 }}` |

## Zustand Store Debugging

```typescript
// Check store state in browser console
import { useNotesStore } from '@/store/notes.store';
const store = useNotesStore();
console.log(store.getState()); // See all state
console.log(store.notes);
console.log(store.isModalOpen);
```

## React Query Debugging

```bash
# Install React Query DevTools browser extension
# Or add to app (if not already present):
npm install @tanstack/react-query-devtools

# Then in App.tsx:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Add <ReactQueryDevtools initialIsOpen={false} /> to App
```

## API Debugging

### Test Endpoints via cURL
```bash
# Get all notes
curl http://localhost:3001/api/notes

# Create note
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "type": "note"}'

# Get pending reminders
curl http://localhost:3001/api/reminders/pending

# Update note
curl -X PATCH http://localhost:3001/api/notes/note-id \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

### Common API Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Note/reminder created |
| 204 | No Content - Delete successful (empty response) |
| 400 | Bad Request - Validation failed |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server crashed |

## Git Workflow

### Before Committing
```bash
# 1. Build both frontend and backend
cd frontend && npm run build  # Check for errors
cd ../backend && npm run build

# 2. Run type-check
npm run tsc -- --noEmit

# 3. Commit if all pass
git add .
git commit -m "description"
```

### Revert Last Commit (if needed)
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
git reset --hard HEAD~1  # Undo commit and changes
```

## Environment Variables

### Frontend `.env` (optional)
```
VITE_API_URL=http://localhost:3001
```

### Backend `.env` (required)
```
DATABASE_URL=postgresql://user:password@localhost:5432/notesapp_dev
NODE_ENV=development
PORT=3001
```

## Performance Tips

1. **Frontend:** Reminders filter runs on every dashboard load—cache with React Query
2. **Backend:** Use database indexes on `notes.type` and `notes.done` for reminder queries
3. **Drag-and-drop:** Keep reorder state in memory; batch updates before saving
4. **Calendar:** Memoize event calculations to avoid re-renders

## Debugging Summary

| Problem | Tool | Command |
|---------|------|---------|
| TypeScript errors | tsc | `npm run tsc -- --noEmit` |
| Build errors | Vite | `npm run build` |
| Runtime errors | Browser DevTools | F12 |
| Store state | React DevTools | `useNotesStore().getState()` |
| API response | Network tab | F12 Network or cURL |
| Database queries | Prisma Studio | `npx prisma studio` |
| Port conflicts | lsof (macOS) / netstat (Windows) | Check `netstat -tuln` |

## Prisma Studio (GUI Database Explorer)

```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
# Browse tables, add/edit/delete records graphically
```
