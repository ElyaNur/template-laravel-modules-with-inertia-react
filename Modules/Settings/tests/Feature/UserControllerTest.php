<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as AssertableInertia;
use Modules\Settings\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(
        User::factory()->create([
            'username' => 'user_'.Str::random(8),
        ])
    );
});

it('renders user index with existing users', function () {
    $role = Role::withoutEvents(fn () => Role::create([
        'name' => 'editor',
        'guard_name' => 'web',
    ]));

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    $listedUser = User::factory()->create([
        'username' => 'account_'.Str::random(8),
        'name' => 'Listed User',
    ]);

    $listedUser->assignRole($role);

    $response = $this->get(route('settings.user.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Settings::users/index', false)
        ->where('users.data.0.id', $listedUser->id)
        ->where('users.data.0.name', 'Listed User')
    );
});
