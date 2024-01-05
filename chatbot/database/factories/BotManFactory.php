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
                'botman_name' => $faker->userName,
                'number_of_calls' => $faker->numberBetween(0, 100),
                'user_id'=>User::factory(), 
        ];
    }
}
