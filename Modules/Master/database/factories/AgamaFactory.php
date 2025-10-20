<?php

namespace Modules\Master\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Master\Agama;

class AgamaFactory extends Factory
{
    protected $model = Agama::class;

    public function definition(): array
    {
        return [
            'nama' => $this->faker->word(),
        ];
    }
}
