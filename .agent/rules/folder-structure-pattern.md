---
trigger: always_on
---

# React Pages Folder Structure Pattern

## ✅ CORRECT Pattern

Pages **MUST** be organized in subfolders within `pages/`:

```
resources/js/pages/
└── tasks/              ← Subfolder for grouping related pages
    ├── index.tsx
    ├── create.tsx
    ├── edit.tsx
    ├── show.tsx
    ├── kanban.tsx
    └── columns.tsx
```

**Controller render path:**
```php
return Inertia::render('TaskManagement::tasks/index', [...]);
                                    //  ^^^^^^ subfolder name
```

## ❌ WRONG Pattern

**DO NOT** place files directly in `pages/`:

```
resources/js/pages/
├── index.tsx        ← WRONG
├── create.tsx       ← WRONG  
└── edit.tsx         ← WRONG
```

## 📚 Examples from Settings Module

### Menus
```
pages/menus/
├── index.tsx
├── cru.tsx
└── is-active-switch.tsx
```
Controller: `Inertia::render('Settings::menus/index')`

### Roles
```
pages/roles/
├── index.tsx
└── cru.tsx
```
Controller: `Inertia::render('Settings::roles/index')`

### Users
```
pages/users/
├── index.tsx
└── cru.tsx
```
Controller: `Inertia::render('Settings::users/index')`

## 🎯 Why This Pattern?

1. **Inertia Resolver**: The custom page resolver (`page-resolver.ts`) looks for pages at:
   ```
   Modules/{ModuleName}/resources/js/pages/{subfolder}/{page}
   ```

2. **Organization**: Groups related pages together (CRUD operations)

3. **Controller Clarity**: Render path clearly indicates module and feature
   ```php
   'TaskManagement::tasks/kanban'
   //  Module      Group  Page
   ```

4. **Consistency**: Matches Laravel's resource organization patterns

## 🔧 Correct Implementation Checklist

- [ ] Create subfolder in `resources/js/pages/`
- [ ] Move all page files into subfolder
- [ ] Update controller `Inertia::render()` paths
- [ ] Verify import paths in pages still work
- [ ] Test all routes render correctly

**Remember**: Always follow this pattern for future modules!
