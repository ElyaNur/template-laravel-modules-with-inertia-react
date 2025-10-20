<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\Settings\Database\Seeders\MenuSeeder;
use Modules\Settings\Database\Seeders\ModelHasRolesSeeder;
use Modules\Settings\Database\Seeders\PermissionsSeeder;
use Modules\Settings\Database\Seeders\RoleHasPermissionsSeeder;
use Modules\Settings\Database\Seeders\RolesSeeder;
use Modules\Settings\Database\Seeders\UsersSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MenuSeeder::class);
        DB::table('menu')->selectRaw("setval('menu_id_seq', max(id))")->first();
        $this->call(UsersSeeder::class);
        DB::table('users')->selectRaw("setval('users_id_seq', max(id))")->first();
        $this->call(RolesSeeder::class);
        DB::table('roles')->selectRaw("setval('roles_id_seq', max(id))")->first();
        $this->call(PermissionsSeeder::class);
        DB::table('permissions')->selectRaw("setval('permissions_id_seq', max(id))")->first();
        $this->call(RoleHasPermissionsSeeder::class);
        $this->call(ModelHasRolesSeeder::class);
    }
}
