<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Modules\Settings\Contracts\Services\PermissionServiceInterface;
use Modules\Settings\Http\Requests\PermissionRequest;
use Modules\Settings\Menu;

class StorePermissionController extends Controller
{
    use AuthorizesRequests;

    function __construct(private readonly PermissionServiceInterface $permissionService) {
    }

    public function __invoke(PermissionRequest $request)
    {
        $this->authorize('create', Menu::class);
        $type = request('type');
        $menuId = request('menu');
        $route = $type === 'create' ? 'settings.menu.create' : 'settings.menu.edit';

        return redirect()->route($route, $menuId)->with('toast', $this->permissionService->save($request->validated()));
    }
}
