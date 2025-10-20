<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;

class ModelHasRolesSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('model_has_roles')->delete();

        \DB::table('model_has_roles')->insert([
            0 => [
                'role_id' => 1,
                'model_type' => 'App\\Models\\User',
                'model_id' => 1,
            ],
            1 => [
                'role_id' => 4,
                'model_type' => 'App\\Models\\User',
                'model_id' => 4,
            ],
        ]);
    }
}
