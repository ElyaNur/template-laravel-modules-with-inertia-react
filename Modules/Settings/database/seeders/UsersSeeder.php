<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        \DB::table('users')->delete();

        \DB::table('users')->insert([
            0 => [
                'id' => 4,
                'name' => 'Ahmad Charis Elyasa Hafidianto',
                'password' => '$2y$12$XjdQBH8yy3bRuIrvx2fhdu00DEEWPCemhVCfEt6rBgOh06xIL8yxe',
                'remember_token' => null,
                'created_at' => '2024-12-06 08:15:54',
                'updated_at' => '2024-12-06 08:15:54',
                'username' => 'chariselyasa',
                'email' => 'charis.aceh@gmail.com',
                'email_verified_at' => null,
                'deleted_at' => null,
            ],
            1 => [
                'id' => 1,
                'name' => 'Super Admin',
                'password' => '$2y$12$XjdQBH8yy3bRuIrvx2fhdu00DEEWPCemhVCfEt6rBgOh06xIL8yxe',
                'remember_token' => 'kMo2Wo2CbMjZnKiD8NRddtiC9FlDITfHaWcNSc62ZGCDocZCRsSHgHDnfqS0',
                'created_at' => '2024-11-23 06:38:04',
                'updated_at' => '2024-12-21 15:18:57',
                'username' => 'super_admin',
                'email' => 'superadmin@email.com',
                'email_verified_at' => null,
                'deleted_at' => null,
            ],
        ]);
    }
}
