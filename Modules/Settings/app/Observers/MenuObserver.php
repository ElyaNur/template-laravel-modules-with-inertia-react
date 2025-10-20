<?php

namespace Modules\Settings\Observers;

use Modules\Settings\Menu;

class MenuObserver
{
    public function created(Menu $menu): void
    {
        cache()->tags('menus')->flush();
    }

    public function updated(Menu $menu): void
    {
        cache()->tags('menus')->flush();
    }

    public function deleted(Menu $menu): void
    {
        cache()->tags('menus')->flush();
    }

    public function restored(Menu $menu): void
    {
        cache()->tags('menus')->flush();
    }
}
