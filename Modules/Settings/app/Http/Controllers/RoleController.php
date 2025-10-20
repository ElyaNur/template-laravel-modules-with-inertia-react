<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Modules\Settings\Contracts\Services\RoleServiceInterface;
use Modules\Settings\Http\Requests\RoleRequest;
use Modules\Settings\Role;

class RoleController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly RoleServiceInterface $roleService,
    ) {}

    public function index()
    {
        return inertia('Settings::roles/index', [
            'roles' => $this->roleService->getRoles(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Role::class);

        return inertia('Settings::roles/create', [
            'listMenuWithPermission' => $this->roleService->getListMenuWithPermissions(),
            'type' => 'create',
        ]);
    }

    public function store(RoleRequest $request)
    {
        $createAnother = boolval(request('create_another'));

        $validated = $request->validated();

        $route = $createAnother ? 'settings.role.create' : 'settings.role.index';

        return redirect()->route($route)->with('toast', $this->roleService->save($validated));
    }

    public function show(Role $role)
    {
        $this->authorize('view', $role);

        return inertia('Settings::roles/show', [
            'listMenuWithPermission' => $this->roleService->getListMenuWithPermissions($role),
            'role' => $role,
            'type' => 'show',
        ]);
    }

    public function edit(Role $role)
    {
        $this->authorize('edit', Role::class);

        return inertia('Settings::roles/edit', [
            'listMenuWithPermission' => $this->roleService->getListMenuWithPermissions($role),
            'role' => $role,
            'list_role' => $this->roleService->getListRole(),
            'type' => 'edit',
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $validated = $request->validated();
        $redirectBack = boolval(request('redirect_back', false));

        if (! empty($validated['parent_id']) || $redirectBack) {
            return redirect()->back()->with('toast', $this->roleService->update($role, $validated));
        }

        return redirect()->route('settings.role.show', $role)->with('toast', $this->roleService->update($role, $validated));
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);

        return redirect()->back()->with('toast', $this->roleService->delete($role));
    }
}
