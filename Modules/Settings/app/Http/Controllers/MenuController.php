<?php

namespace Modules\Settings\Http\Controllers;

use App\Contracts\Services\HelperServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Settings\Contracts\Services\MenuServiceInterface;
use Modules\Settings\Contracts\Services\PermissionServiceInterface;
use Modules\Settings\Http\Requests\MenuRequest;
use Modules\Settings\Menu;

class MenuController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly MenuServiceInterface       $menuService,
        private readonly HelperServiceInterface     $helperService,
        private readonly PermissionServiceInterface $permissionService
    )
    {
    }

    public function index()
    {
        $this->authorize('viewAny', Menu::class);

        ds($this->menuService->getMenu());

        return Inertia::render('Settings::menus/index', [
            'menus' => $this->menuService->getMenu(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Menu::class);

        return inertia('Settings::menus/create', [
            'list_menu' => Menu::whereNull('parent_id')->get(),
            'list_model' => $this->helperService->getListModel(),
            'list_permission' => $this->permissionService->getListPermission(),
            'type' => 'create',
        ]);
    }

    public function store(MenuRequest $request)
    {
        $createAnother = boolval(request('create_another'));

        $validated = $request->validated();

        $route = $createAnother ? 'settings.menu.create' : 'settings.menu.index';

        if (!empty($validated['parent_id'])) {
            return redirect()->back()->with('toast', $this->menuService->save($validated));
        }

        return redirect()->route($route)->with('toast', $this->menuService->save($validated));
    }

    public function show(Menu $menu)
    {
        $this->authorize('view', $menu);

        return inertia('Settings::menus/show', [
            'menu' => $menu,
            'list_menu' => Menu::whereNull('parent_id')->get(),
            'list_model' => $this->helperService->getListModel(),
            'list_permission' => $this->permissionService->getListPermission(),
            'type' => 'show',
        ]);
    }


    public function edit(Menu $menu)
    {
        $this->authorize('edit', Menu::class);

        return inertia('Settings::menus/edit', [
            'list_menu' => Menu::whereNull('parent_id')->get(),
            'list_model' => $this->helperService->getListModel(),
            'list_permission' => $this->permissionService->getListPermission(),
            'menu' => $menu,
            'subMenus' => $this->menuService->getSubMenu($menu),
            'type' => 'edit',
        ]);
    }

    public function getNextSort(?Menu $menu = null)
    {
        return response()->json([
            'sort' => $this->menuService->getNextSortMenu($menu),
        ]);
    }

    public function update(MenuRequest $request, Menu $menu)
    {
        $validated = $request->validated();
        $redirectBack = boolval(request('redirect_back', false));

        if (!empty($validated['parent_id']) || $redirectBack) {
            return redirect()->back()->with('toast', $this->menuService->update($menu, $validated));
        }

        return redirect()->route('settings.menu.index')->with('toast', $this->menuService->update($menu, $validated));
    }

    public function restore(int $menu)
    {
        $this->authorize('restore', Menu::class);

        return redirect()->back()->with('toast', $this->menuService->restore($menu));

    }

    public function destroy(Menu $menu)
    {
        $this->authorize('delete', $menu);

        return redirect()->back()->with('toast', $this->menuService->delete($menu));
    }

    public function forceDestroy(int $menu)
    {
        $this->authorize('forceDelete', Menu::class);

        return redirect()->back()->with('toast', $this->menuService->forceDelete($menu));
    }

    public function destroyBulk(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        return redirect()->back()->with('toast', $this->menuService->deleteBulk($validated));
    }
}
