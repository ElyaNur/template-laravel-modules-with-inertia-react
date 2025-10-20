<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Modules\Settings\Contracts\Services\RoleServiceInterface;
use Modules\Settings\Contracts\Services\UserServiceInterface;
use Modules\Settings\Http\Requests\UserRequest;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly UserServiceInterface $userService,
        private readonly RoleServiceInterface $roleService,
    ) {}

    public function index()
    {
        return inertia('Settings::users/index', [
            'users' => $this->userService->getUsers(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return inertia('Settings::users/create', [
            'list_role' => $this->roleService->getListRole(),
            'type' => 'create',
        ]);
    }

    public function store(UserRequest $request)
    {
        $createAnother = boolval(request('create_another'));

        $validated = $request->validated();

        $route = $createAnother ? 'settings.user.create' : 'settings.user.index';

        return redirect()->route($route)->with('toast', $this->userService->save($validated));
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        return inertia('Settings::users/show', [
            'user' => $user->load('roles'),
            'list_role' => $this->roleService->getListRole(),
            'type' => 'show',
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('edit', User::class);

        return inertia('Settings::users/edit', [
            'user' => $user->load('roles'),
            'list_role' => $this->roleService->getListRole(),
            'type' => 'edit',
        ]);
    }

    public function update(UserRequest $request, User $user)
    {
        $validated = $request->validated();
        $redirectBack = boolval(request('redirect_back', false));

        if ($redirectBack) {
            return redirect()->back()->with('toast', $this->userService->update($user, $validated));
        }

        return redirect()->route('settings.user.index')->with('toast', $this->userService->update($user, $validated));
    }

    public function restore(int $user)
    {
        $this->authorize('restore', User::class);

        return redirect()->back()->with('toast', $this->userService->restore($user));
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        return redirect()->back()->with('toast', $this->userService->delete($user));
    }

    public function forceDestroy(int $user)
    {
        $this->authorize('forceDelete', User::class);

        return redirect()->back()->with('toast', $this->userService->forceDelete($user));
    }

    public function destroyBulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        return redirect()->back()->with('toast', $this->userService->deleteBulk($validated));
    }
}
