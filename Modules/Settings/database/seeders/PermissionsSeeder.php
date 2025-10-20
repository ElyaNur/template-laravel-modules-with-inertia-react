<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('permissions')->delete();

        \DB::table('permissions')->insert([
            0 => [
                'id' => 13,
                'name' => 'dashboard:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-11-28 08:08:58',
                'updated_at' => '2024-11-28 08:08:58',
            ],
            1 => [
                'id' => 15,
                'name' => 'settings:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-11-28 08:52:47',
                'updated_at' => '2024-11-28 08:52:47',
            ],
            2 => [
                'id' => 16,
                'name' => 'utility:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-11-28 08:53:36',
                'updated_at' => '2024-11-28 08:53:36',
            ],
            3 => [
                'id' => 1418,
                'name' => 'menu:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            4 => [
                'id' => 1419,
                'name' => 'menu:view',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            5 => [
                'id' => 1420,
                'name' => 'menu:edit',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            6 => [
                'id' => 1421,
                'name' => 'menu:create',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            7 => [
                'id' => 1422,
                'name' => 'menu:update',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            8 => [
                'id' => 1423,
                'name' => 'menu:delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            9 => [
                'id' => 1424,
                'name' => 'menu:restore',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            10 => [
                'id' => 1425,
                'name' => 'menu:force-delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            11 => [
                'id' => 1426,
                'name' => 'user:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            12 => [
                'id' => 1427,
                'name' => 'user:view',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            13 => [
                'id' => 1428,
                'name' => 'user:create',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            14 => [
                'id' => 1429,
                'name' => 'user:update',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            15 => [
                'id' => 1430,
                'name' => 'user:delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            16 => [
                'id' => 1431,
                'name' => 'user:restore',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            17 => [
                'id' => 1432,
                'name' => 'user:force-delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-04 15:48:29',
                'updated_at' => '2024-12-04 15:48:29',
            ],
            18 => [
                'id' => 39,
                'name' => 'menu:sub-menu',
                'guard_name' => 'web',
                'created_at' => '2024-11-30 12:45:00',
                'updated_at' => '2024-11-30 12:45:00',
            ],
            19 => [
                'id' => 40,
                'name' => 'menu:parent-menu',
                'guard_name' => 'web',
                'created_at' => '2024-11-30 12:45:00',
                'updated_at' => '2024-11-30 12:45:00',
            ],
            20 => [
                'id' => 1438,
                'name' => 'role:view-any',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            21 => [
                'id' => 1439,
                'name' => 'role:view',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            22 => [
                'id' => 1440,
                'name' => 'role:create',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            23 => [
                'id' => 1441,
                'name' => 'role:update',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            24 => [
                'id' => 1442,
                'name' => 'role:delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            25 => [
                'id' => 1443,
                'name' => 'role:restore',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
            26 => [
                'id' => 1444,
                'name' => 'role:force-delete',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 02:45:12',
                'updated_at' => '2024-12-06 02:45:12',
            ],
        ]);
    }
}
