<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as AssertableInertia;
use Modules\Settings\Role;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(
        User::factory()->create([
            'username' => 'user_'.Str::random(8),
        ])
    );
});

it('renders role index with existing roles', function () {
    $role = Role::withoutEvents(fn () => Role::create([
        'name' => 'manager',
        'guard_name' => 'web',
    ]));

    $response = $this->get(route('settings.role.index'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Settings::roles/index', false)
        ->where('roles.data.0.id', $role->id)
        ->where('roles.data.0.name', 'manager')
    );
});
