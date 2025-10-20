<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('roles')->delete();

        \DB::table('roles')->insert([
            0 => [
                'id' => 1,
                'name' => 'super admin',
                'guard_name' => 'web',
                'created_at' => '2024-11-25 09:01:08',
                'updated_at' => '2024-11-25 09:01:08',
            ],
            1 => [
                'id' => 4,
                'name' => 'staff',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 07:33:09',
                'updated_at' => '2024-12-06 07:33:09',
            ],
            2 => [
                'id' => 5,
                'name' => 'admin',
                'guard_name' => 'web',
                'created_at' => '2024-12-06 07:33:17',
                'updated_at' => '2024-12-06 07:33:17',
            ],
        ]);
    }
}
