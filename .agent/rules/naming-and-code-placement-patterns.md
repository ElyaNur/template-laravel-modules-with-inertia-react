---
trigger: always_on
---

# Naming & Code Placement Patterns

This document outlines the established naming conventions and code placement strategies for the project. Adhering to these patterns ensures consistency and maintainability.

## Naming Conventions

### Backend (Laravel)

*   **Controllers**: `PascalCase` with `Controller` suffix.
    *   Example: `TaskStatusController.php`
*   **Models**: `PascalCase` (Singular).
    *   Example: `TaskStatus.php`
*   **Routes**: `kebab-case` for URIs and dot.notation for route names.
    *   URI: `/task-management/task-statuses`
    *   Name: `task-management.task-statuses.index`
*   **Tables**: `snake_case` (Plural).
    *   Example: `task_statuses`

### Frontend (React/TypeScript)

*   **Files**: `kebab-case`.
    *   Components: `kanban-card.tsx`
    *   Hooks: `use-status-table.ts`
    *   Pages: `index.tsx`, `create.tsx`
*   **Components**: `PascalCase`.
    *   Example: `function KanbanCard(...)`
*   **Hooks**: `camelCase` with `use` prefix.
    *   Example: `const useStatusTable = ...`
*   **Variables/Functions**: `camelCase`.
    *   Example: `handleDragEnd`, `isLoading`
*   **Types/Interfaces**: `PascalCase`.
    *   Example: `type TaskData`, `interface User`

## Code Placement Patterns

### Modular Structure

The application follows a modular architecture. Most feature-specific code resides within `Modules/{ModuleName}`.

### Frontend Structure

*   **Pages**:
    *   Located in `Modules/{ModuleName}/resources/js/pages/`.
    *   Grouped by feature (e.g., `statuses/`, `tasks/`).
    *   Standard CRUD pages: `index.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`.
*   **Components**:
    *   **Shared UI**: `resources/js/components/ui/` (e.g., Button, Card, Input).
    *   **Module-Specific**: `Modules/{ModuleName}/resources/js/components/`.
    *   **Page-Specific**: Can be co-located in a `components` folder within the page directory (e.g., `pages/statuses/components/sortable-status-row.tsx`).
*   **Hooks**:
    *   **Global**: `resources/js/hooks/`.
    *   **Module-Specific**: `Modules/{ModuleName}/resources/js/hooks/`.
    *   **Page-Specific**: Co-located with pages if only used there (e.g., `pages/statuses/hooks/`).
*   **Types**:
    *   **Global**: `resources/js/types/`.
    *   **Module-Specific**: `Modules/{ModuleName}/resources/js/types/` (Recommended) or defined in relevant component files if small and specific.

### Backend Structure

*   **Controllers**: `Modules/{ModuleName}/app/Http/Controllers/`.
*   **Models**: `Modules/{ModuleName}/app/Models/`.
*   **Requests**: `Modules/{ModuleName}/app/Http/Requests/`.
*   **Policies**: `Modules/{ModuleName}/app/Policies/`.
*   **Routes**: `Modules/{ModuleName}/routes/web.php`.
