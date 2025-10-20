<?php

namespace Modules\Settings\Services;

use App\Services\ServiceWithSoftDelete;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Settings\Contracts\Services\MenuServiceInterface;
use Modules\Settings\Menu;

final class MenuService extends ServiceWithSoftDelete implements MenuServiceInterface
{
    public function __construct()
    {
        parent::__construct(Menu::class);
    }

    public function getMenu(): LengthAwarePaginator
    {
        $filter = request('filter');
        $sort = request('sort');
        $withTrashed = request('withTrashed', 'without-trashed');

        return Menu::query()
            ->whereNull('parent_id')
            ->when(
                $filter,
                fn ($query, $filter) => $query->where('nama', 'like', "%$filter%")
            )
            ->when(
                $sort,
                function ($query, $sort) {
                    $exploded = explode(':', $sort);
                    $query->orderBy($exploded[0], $exploded[1]);
                },
                fn ($query) => $query->orderByDesc('id')
            )
            ->when(
                $withTrashed !== 'without-trashed',
                fn ($query) => $query
                    ->when(
                        $withTrashed === 'only-trashed',
                        fn ($query) => $query->onlyTrashed(),
                        fn ($query) => $query->withTrashed()
                    )
            )
            ->paginate(10);
    }

    public function getSubMenu(Menu $menu): LengthAwarePaginator
    {
        $filter = request('filter');
        $sort = request('sort');
        $withTrashed = request('withTrashed', 'without-trashed');

        return Menu::query()
            ->whereParentId($menu->id)
            ->when(
                $filter,
                fn ($query, $filter) => $query->where('nama', 'like', "%$filter%")
            )
            ->when(
                $sort,
                function ($query, $sort) {
                    $exploded = explode(':', $sort);
                    $query->orderBy($exploded[0], $exploded[1]);
                },
                fn ($query) => $query->orderByDesc('id')
            )
            ->when(
                $withTrashed !== 'without-trashed',
                fn ($query) => $query
                    ->when(
                        $withTrashed === 'only-trashed',
                        fn ($query) => $query->onlyTrashed(),
                        fn ($query) => $query->withTrashed()
                    )
            )
            ->paginate(10);
    }

    public function getNextSortMenu(?Menu $menu): int
    {
        return $menu
            ? Menu::where('parent_id', $menu->id)->max('sort') + 1
            : Menu::whereNull('parent_id')->max('sort') + 1;
    }
}
