<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Middleware;
use Modules\Settings\Menu;
use ReflectionClass;
use Spatie\Permission\Models\Permission;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'toast' => $request->session()->get('toast'),
            'appMenu' => $this->menu(),
        ];
    }

    private function menu(): Collection
    {
        return Auth::check() ? $this->fetchCachedMenu() : collect();
    }

    private function fetchCachedMenu(): Collection
    {
        $cacheKey = 'menus:'.auth()->user()->id;

        return cache()->tags('menus')->rememberForever(
            $cacheKey,
            fn () => $this->getMenu()
        );
    }

    private function getMenu(): Collection
    {
        $menu = $this->getActiveMenu();
        $permissions = $this->calculatePermissions();


        $filteredMenu = $this->filterMenuByPermissions($menu, $permissions);

        return $filteredMenu->map(fn ($item) => [
            'title' => $item->nama,
            'icon' => $item->icon,
            'isActive' => $item->is_active,
            'items' => $item->subMenu->map(fn ($subItem) => [
                'title' => $subItem->nama,
                'route' => $subItem->route,
            ]),
            'route' => $item->route,
        ]);
    }

    private function getActiveMenu(): Collection
    {
        return Menu::select(['id', 'parent_id', 'nama', 'icon', 'permissions', 'models', 'is_active', 'sort'])
            ->with(['subMenu' => fn ($q) => $q->select(['id', 'parent_id', 'nama', 'permissions', 'models', 'is_active', 'sort'])->active()->orderBy('sort')])
            ->active()
            ->whereNull('parent_id')
            ->orderBy('sort')
            ->get();
    }

    private function calculatePermissions()
    {
        $user = auth()->user();
        $roles = $user->roles()->with('permissions')->get();

        if ($roles->contains('name', 'super admin')) {
            return Permission::all()->pluck('name')->map(fn ($name) => mb_strtolower($name))->toArray();
        }

        return $roles->pluck('permissions')->flatten()->unique('name')->pluck('name')->map(fn ($name) => mb_strtolower($name))->toArray();
    }

    private function filterMenuByPermissions(Collection $menu, array $permissions): Collection
    {
        return $menu
            ->filter($this->filteringModelAndPermissionOnMenu(collect($permissions)))
            ->values()
            ->map(
                fn ($item) => $item->setRelation(
                    'subMenu',
                    $item
                        ->subMenu
                        ->filter($this->filteringModelAndPermissionOnMenu(collect($permissions)))
                        ->values()
                )
            );
    }

    private function filteringModelAndPermissionOnMenu($permissions): Closure
    {
        return function (Menu $menu) use ($permissions) {
            $models = $menu->models?->map(
                fn ($model) => Gate::getPolicyFor($model) ? collect((new ReflectionClass(Gate::getPolicyFor($model)))->getMethods())
                    ->pluck('name')
                    ->filter(fn ($method) => $method === 'viewAny')
                    ->map(fn ($permission) => Str::kebab(class_basename($model)).':'.Str::kebab($permission))
                    : collect()
            )->flatten() ?? collect();

            $permission = $menu->permissions ?? collect();

            $merge = $models->merge($permission);

            $mergeNotEmpty = ! $merge->isEmpty();
            $allMergeInPermissions = $merge->diff($permissions)->isEmpty();
            $moreMergeInPermissionsThanNot = $merge->diff($permissions)->count() < $merge->count();

            return $mergeNotEmpty && ($allMergeInPermissions || $moreMergeInPermissionsThanNot);
        };
    }
}
