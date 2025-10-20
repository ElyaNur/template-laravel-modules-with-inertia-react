<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;

class RoleHasPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('role_has_permissions')->delete();

        \DB::table('role_has_permissions')->insert([
            0 => [
                'permission_id' => 1418,
                'role_id' => 5,
            ],
            1 => [
                'permission_id' => 1419,
                'role_id' => 5,
            ],
            2 => [
                'permission_id' => 1420,
                'role_id' => 5,
            ],
            3 => [
                'permission_id' => 1421,
                'role_id' => 5,
            ],
            4 => [
                'permission_id' => 1422,
                'role_id' => 5,
            ],
            5 => [
                'permission_id' => 1423,
                'role_id' => 5,
            ],
            6 => [
                'permission_id' => 1424,
                'role_id' => 5,
            ],
            7 => [
                'permission_id' => 1425,
                'role_id' => 5,
            ],
            8 => [
                'permission_id' => 13,
                'role_id' => 5,
            ],
            9 => [
                'permission_id' => 1426,
                'role_id' => 5,
            ],
            10 => [
                'permission_id' => 1427,
                'role_id' => 5,
            ],
            11 => [
                'permission_id' => 1428,
                'role_id' => 5,
            ],
            12 => [
                'permission_id' => 1429,
                'role_id' => 5,
            ],
            13 => [
                'permission_id' => 1430,
                'role_id' => 5,
            ],
            14 => [
                'permission_id' => 1431,
                'role_id' => 5,
            ],
            15 => [
                'permission_id' => 1432,
                'role_id' => 5,
            ],
            16 => [
                'permission_id' => 15,
                'role_id' => 5,
            ],
            17 => [
                'permission_id' => 1438,
                'role_id' => 5,
            ],
            18 => [
                'permission_id' => 1439,
                'role_id' => 5,
            ],
            19 => [
                'permission_id' => 1440,
                'role_id' => 5,
            ],
            20 => [
                'permission_id' => 1441,
                'role_id' => 5,
            ],
            21 => [
                'permission_id' => 1442,
                'role_id' => 5,
            ],
            22 => [
                'permission_id' => 1443,
                'role_id' => 5,
            ],
            23 => [
                'permission_id' => 1444,
                'role_id' => 5,
            ],
            24 => [
                'permission_id' => 13,
                'role_id' => 4,
            ],
        ]);
    }
}
