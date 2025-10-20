<?php

namespace Modules\Settings\Contracts\Services;

use App\Contracts\Services\ServiceInterface;
use App\Contracts\Services\WithSoftDeleteInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Settings\Menu;

/**
 * @extends ServiceInterface<Menu>
 */
interface MenuServiceInterface extends ServiceInterface, WithSoftDeleteInterface
{
    public function getMenu(): LengthAwarePaginator;

    public function getSubMenu(Menu $menu): LengthAwarePaginator;

    public function getNextSortMenu(?Menu $menu): int;
}
