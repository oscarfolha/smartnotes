---
name: frontend-patterns
description: "Use when: adding components, fixing UI issues, extending pages with MUI. Covers component structure, form patterns, state management, and MUI best practices"
applyTo: "frontend/src/**/*.tsx"
---

# Frontend Patterns & Guidelines

## Component Architecture

### Page Template (MUI Layout)
```typescript
import { Box, Container, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNotesStore } from '@/store/notes.store';

export default function NewPage() {
  const store = useNotesStore();
  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => { /* fetch */ },
  });

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pt: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>Page Title</Typography>
        {/* Content */}
      </Container>
    </Box>
  );
}
```

### Component Template (MUI Card)
```typescript
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { DeleteIcon, EditIcon } from '@mui/icons-material';

interface Props {
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ItemCard({ title, onEdit, onDelete }: Props) {
  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Typography variant="h6">{title}</Typography>
          <Box>
            {onEdit && <IconButton size="small" onClick={onEdit}><EditIcon /></IconButton>}
            {onDelete && <IconButton size="small" onClick={onDelete}><DeleteIcon /></IconButton>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
```

## Form Patterns

### Form with React Hook Form + Zod + MUI
```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { TextField, Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormData = z.infer<typeof schema>;

export default function ItemForm({ open, onClose, onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', priority: 'medium' },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Title"
              error={!!error}
              helperText={error?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
        {/* More fields */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
```

## State Management (Zustand Store)

### Store Structure
```typescript
import { create } from 'zustand';

interface NotesStore {
  notes: Note[];
  selectedNoteId: string | null;
  isModalOpen: boolean;
  initialDate: string | null;
  
  // Actions
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  openModal: (options?: { noteId?: string; initialDate?: string }) => void;
  closeModal: () => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  selectedNoteId: null,
  isModalOpen: false,
  initialDate: null,

  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
  openModal: (options) =>
    set({
      isModalOpen: true,
      selectedNoteId: options?.noteId ?? null,
      initialDate: options?.initialDate ?? null,
    }),
  closeModal: () =>
    set({ isModalOpen: false, selectedNoteId: null, initialDate: null }),
}));
```

### Using Store in Components
```typescript
function NoteModal() {
  const { selectedNoteId, initialDate, closeModal } = useNotesStore();
  
  // Use selectedNoteId and initialDate to populate form
  // Call closeModal() after submit
}
```

## MUI Common Patterns

### App Preferences Pattern
```typescript
// Use centralized context for app-wide preferences
const { language, setLanguage, themeMode, setThemeMode, t } = useAppPreferences();

// Persist language/theme in localStorage
// Persist session-only UI choices (e.g. dashboard period) in sessionStorage
```

### Create Note Date Default
```typescript
// Non-calendar create actions should default to "now"
openModal({ initialDate: new Date().toISOString() });

// Calendar slot create should pass clicked slot date
openModal({ initialDate: slot.start.toISOString() });
```

### Archive Actions
```typescript
// Archive page should support both restore and permanent delete
useUnarchiveNote();
useDeleteNote();

// Archive page should expose client-side filters
// search + type + priority + tag + clear
```

### Responsive Grid Layout
```typescript
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
    <NoteCard item={item} />
  </Grid>
</Grid>
```

### Delete Confirmation Dialog
```typescript
const [openDelete, setOpenDelete] = useState(false);

return (
  <>
    <IconButton onClick={() => setOpenDelete(true)}><DeleteIcon /></IconButton>
    
    <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
      <DialogTitle>Delete Note?</DialogTitle>
      <DialogContent>This action cannot be undone.</DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
        <Button
          onClick={async () => {
            await deleteNote(id);
            setOpenDelete(false);
          }}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
```

### Drag-and-Drop Pattern
```typescript
// On dashboard or list
const [draggedId, setDraggedId] = useState<string | null>(null);

<Box draggable onDragStart={() => setDraggedId(id)} onDrop={handleReorder}>
  <DragIndicatorIcon sx={{ cursor: 'grab' }} />
</Box>

// Reorder state is client-side; update local array, then optionally POST new order
```

### Dashboard Period Filter Pattern
```typescript
type DashboardPeriod = 'week' | 'month' | 'year';
const [period, setPeriod] = useState<DashboardPeriod>('week');

// Filter visible notes by selected period before rendering
// Use isSameWeek/isSameMonth/isSameYear from date-fns
```

### Floating Label Safety for Filled Fields
```typescript
<TextField
  label="Title"
  slotProps={{ inputLabel: { shrink: true } }}
  ...
/>

<TextField
  label="Content"
  multiline
  slotProps={{ inputLabel: { shrink: true } }}
  ...
/>
```

Use explicit `shrink: true` for fields that are prefilled via `reset()` to avoid label/text overlap in edit mode.

## React Query Patterns

### Query Hook for Notes
```typescript
export function useNotesQuery() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });
}
```

### Mutation for Create/Update
```typescript
export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteData: CreateNoteRequest) => {
      const res = await fetch('/api/notes', { method: 'POST', body: JSON.stringify(noteData) });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
```

## Common Mistakes to Avoid

1. **Mixing Tailwind and MUI:** Always use MUI components with `sx` prop, not className with Tailwind
   - ❌ `<div className="flex gap-2">`
   - ✅ `<Box sx={{ display: 'flex', gap: 2 }}>`

2. **Icon imports:** Always check MUI icons are exported
   - ❌ `DeleteOutlineIcon` (not exported in v5)
   - ✅ `DeleteIcon`

3. **Modal field management:** Use conditional rendering for form fields based on note type
   - Reminders should hide date/priority fields
   - Regular notes show all fields

4. **Store updates:** Always return new arrays/objects (immutable updates)
   - ❌ `state.notes.push(note)`
   - ✅ `[...state.notes, note]`

5. **Drag-and-drop:** Remember reorder state is client-side only; if you want persistence, add DB order field

## Debugging Tips

- **Build errors:** Check `npm run build` output for MUI import issues
- **UI not updating:** Verify Zustand actions return new state, not mutations
- **Form not submitting:** Check React Hook Form resolver (Zod schema), console for validation errors
- **Modal not closing:** Call `closeModal()` in store and ensure Dialog `open` prop is bound to store state
- **Icons missing:** Verify icon name is in @mui/icons-material exports (test with import)

## Component Checklist

When creating a new component, ensure:
- [ ] Uses MUI components (no Tailwind classNames)
- [ ] Has TypeScript props interface
- [ ] Responsive layout (use Grid, Container, or sx breakpoints)
- [ ] Delete/danger actions show MUI Dialog confirmation
- [ ] Forms use React Hook Form + Zod
- [ ] Store state passed via Zustand, not props drilling
