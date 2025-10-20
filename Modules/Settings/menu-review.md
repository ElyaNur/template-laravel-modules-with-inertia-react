# Settings Module – Menu React Review

## Blocking bugs
- `Modules/Settings/resources/js/pages/menus/cru.tsx:105` – `handleSubmit` bails out whenever `menu` is falsy, which is exactly the case for the create screen. As a result the form never calls `post(...)` and users cannot create new menus (including "Simpan & Buat Lainnya"). Guard on the page `type` or move the null-check inside the edit branch instead.
- `Modules/Settings/resources/js/pages/menus/relations/sub-menu/cru.tsx:106` – identical early-return prevents creating sub menus. The dialog closes without any request being fired.
- `Modules/Settings/resources/js/pages/menus/relations/sub-menu/dialog-cru-sub-menu.tsx:1` – imports from `@/Components/ui/dialog` (uppercase `C`). This passes on Windows but fails on the case-sensitive file systems used in CI and production builds.
- `Modules/Settings/resources/js/pages/menus/columns.tsx:58` & `Modules/Settings/resources/js/pages/menus/relations/sub-menu/columns.tsx:58` – both call `menu.permissions_or_models.slice(...)` without guarding the value. When the API returns `null` (happens for menus without policies) the table throws and the page breaks.

## High impact issues
- `Modules/Settings/resources/js/pages/menus/cru.tsx:95` – `getNextSort()` ignores the selected parent (`data.parent_id`). This means we always fetch the global next sort value so child menus inherit the wrong ordering. Pass the chosen parent ID to the endpoint.
- `Modules/Settings/resources/js/pages/menus/relations/sub-menu/cru.tsx:100` – similar problem: always requests sort based on `parentMenu.id`, so changing a sub menu’s parent in the dialog leaves the sort stale.
- `Modules/Settings/resources/js/pages/menus/cru.tsx:308` – clicking "Edit" on the show screen falls back to `menu?.id || 1`. If the record is missing (e.g. because props failed to load) we hard-redirect to menu ID 1.
- `Modules/Settings/resources/js/pages/menus/hooks/use-menu-table.ts:71` – bulk destroy sends raw `number[]` values cast as `string[]`. Casts disappear at runtime so the query serialises as `ids=1,2,3`, which Laravel ignores unless you parse manually. Use `ids: ids.map(String)` or `ids: ids` with a proper `ids[]` payload.
- `Modules/Settings/resources/js/pages/menus/hooks/use-menu-table.ts:29` – double-check `route().current()`: Ziggy’s `current()` returns a boolean unless you pass a pattern. When it returns `false`, `route('', ...)` throws. Capture the current route name from page props instead of the router helper.
- `Modules/Settings/resources/js/pages/menus/is-active-switch.tsx:11` – we optimistically flip state but never roll back when the request fails. Users end up seeing an "Aktif" state even if the PUT 422s.

## UX & maintainability improvements
- `Modules/Settings/resources/js/pages/menus/cru.tsx:76` & `Modules/Settings/resources/js/pages/menus/relations/sub-menu/cru.tsx:76` – the next-sort fetch re-runs on every description change because `data.keterangan` sits in the dependency array. Restrict it to `data.parent_id` (and possibly debounce) to avoid hammering the API.
- `Modules/Settings/resources/js/pages/menus/cru.tsx:173` & `Modules/Settings/resources/js/pages/menus/relations/sub-menu/cru.tsx:173` – `parseInt('')` produces `NaN`, which then renders as the literal text "NaN". Coerce with `Number(e.target.value) || 0` and block negative values if they are invalid.
- `Modules/Settings/resources/js/pages/menus/cru.tsx:82` – use the functional updater when merging permissions (`setSelectedPermissions(prev => ...)`) to avoid stale closures and unnecessary dependency noise.
- `Modules/Settings/resources/js/pages/menus/columns.tsx:58` & `Modules/Settings/resources/js/pages/menus/relations/sub-menu/columns.tsx:58` – use stable keys (e.g. `permission.value`) instead of array indices so React can reconcile when permissions change.
- `Modules/Settings/resources/js/pages/menus/index.tsx:13` & related files – prefer the `@/actions/...` alias everywhere instead of 6-level relative imports for consistency and easier refactors.
- `Modules/Settings/resources/js/pages/menus/relations/relations.tsx:6` – the tabs list is hard-coded to `grid-cols-2` despite having a single tab, leaving an odd blank column. Adjust the layout or add the missing tabs.
- `Modules/Settings/resources/js/pages/menus/cru.tsx:367` – when creating ad-hoc permissions the payload defaults to `formatPermission(permissionName) + ':'`. Guard against an empty policy so we don’t store dangling colons.
- `Modules/Settings/resources/js/pages/menus/is-active-switch.tsx:18` – surface failure feedback (toasts or inline message) while the switch is disabled so users know why the toggle snapped back.

Feel free to ping me if you want suggested code changes for any of the points above.
