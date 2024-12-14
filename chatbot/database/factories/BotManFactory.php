<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BotMan>
 */
class BotManFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
                'botman_name' => $this->faker->userName,
                'number_of_calls' => $this->faker->numberBetween(0, 5),
        ];
    }
}
