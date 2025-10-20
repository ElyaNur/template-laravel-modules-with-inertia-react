<?php

namespace Modules\Settings\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Modules\Settings\Menu;

class MenuFactory extends Factory
{
    protected $model = Menu::class;

    public function definition(): array
    {
        return [
            'parent_id' => $this->faker->randomNumber(),
            'nama' => $this->faker->word(),
            'urutan' => $this->faker->randomNumber(),
            'aktif' => $this->faker->boolean(),
            'keterangan' => $this->faker->word(),
            'icon' => $this->faker->word(),
            'permission' => $this->faker->words(),
            'model' => $this->faker->words(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
