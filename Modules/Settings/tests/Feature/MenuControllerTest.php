<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as AssertableInertia;
use Modules\Settings\Menu;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    Gate::before(fn () => true);

    $this->actingAs(
        User::factory()->create([
            'username' => 'user_'.Str::random(8),
        ])
    );
});

it('renders menu index with the available menus', function () {
    $menu = Menu::withoutEvents(function () {
        return Menu::create([
            'parent_id' => null,
            'nama' => 'settings',
            'sort' => 1,
            'is_active' => true,
            'keterangan' => 'Settings menu',
            'icon' => 'settings',
            'permissions' => ['settings:view'],
            'models' => ['App\\Models\\User'],
        ]);
    });

    $response = $this->get(route('settings.menu.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Settings::menus/index', false)
        ->where('menus.data.0.id', $menu->id)
        ->where('menus.data.0.nama', 'Settings')
    );
});
