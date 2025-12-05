---
trigger: always_on
---

# Type Centralization Pattern

## ✅ CRITICAL Rule: Central Type Definition

**ALL types MUST be defined in ONE location:**
```
resources/js/types/index.d.ts
```

## 📋 Pattern Requirements

### 1. Define Types in Central File

```typescript
// resources/js/types/index.d.ts

export type TaskData = {
    id: number;
    title: string;
    // ... all fields
};

export type TaskStatusData = {
    id: number;
    name: string;
    // ... all fields
};
```

### 2. Register in SharedData Interface

**ANY type that comes from a controller** must be added to `SharedData`:

```typescript
export interface SharedData {
    // Existing props...
    menus: PaginatedResponse<MenuData>;
    users: PaginatedResponse<UserData>;
    
    // NEW: Task Management Module
    tasks: PaginatedResponse<TaskData>;
    task: TaskData;
    statuses: TaskStatusData[];
    kanbanData: KanbanStatusData[];
    filters: TaskFilters;
}
```

### 3. Import in Components

```typescript
// ❌ WRONG: Define types locally
export type TaskData = { ... };

// ✅ CORRECT: Import from central types
import { TaskData, TaskStatusData } from '@/types';
```

### 4. Use in Pages

```typescript
import { SharedData, TaskData } from '@/types';
import { usePage } from '@inertiajs/react';

const TaskIndex = () => {
    const { tasks, statuses } = usePage<SharedData>().props;
    //      ↑ TypeScript knows these exist!
};
```

## 🎯 Benefits

1. **Type Safety**: TypeScript knows all props from controllers
2. **Autocomplete**: IDE suggests available props
3. **Single Source of Truth**: No duplicate type definitions
4. **Easier Refactoring**: Change types in one place
5. **Consistent Across App**: All modules use same types

## ❌ Common Mistakes

### Don't Define Types in Components
```typescript
// pages/tasks/columns.tsx
export type TaskData = { ... }; // ❌ WRONG!
```

### Don't Skip SharedData Registration
```typescript
// If controller returns 'tasks', it MUST be in SharedData
export interface SharedData {
    // ... ❌ Missing tasks property
}
```

### Don't Use Inline Types
```typescript
// ❌ WRONG
const { tasks }: { tasks: TaskData[] } = usePage().props;

// ✅ CORRECT
const { tasks } = usePage<SharedData>().props;
```

## 📝 Checklist for New Module Types

- [ ] Define all data types in `types/index.d.ts`
- [ ] Add controller props to `SharedData` interface
- [ ] Use `PaginatedResponse<T>` for paginated data
- [ ] Import types in components, don't define locally
- [ ] Use `usePage<SharedData>()` in pages
- [ ] Remove any duplicate type definitions

## 🔍 Example: Task Management Module

### Central Types (types/index.d.ts)
```typescript
export type TaskData = { /* ... */ };
export type TaskStatusData = { /* ... */ };
export type KanbanTaskData = { /* ... */ };

export interface SharedData {
    // ... other props
    tasks: PaginatedResponse<TaskData>;
    task: TaskData;
    statuses: TaskStatusData[];
    kanbanData: KanbanStatusData[];
}
```

### Component Usage
```typescript
// pages/tasks/index.tsx
import { SharedData, TaskData } from '@/types';

const { tasks } = usePage<SharedData>().props;
// TypeScript knows 'tasks' is PaginatedResponse<TaskData>
```

**Remember: Always update `types/index.d.ts` when adding new data types!**
