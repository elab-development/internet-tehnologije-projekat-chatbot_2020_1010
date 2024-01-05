<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;
use App\Models\BotMan;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatHistory>
 */
class ChatHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'botman_id' => BotMan::factory(),
            'timestamp' => $faker->dateTime(),
            'message' => $faker->sentence,
            'response' => $faker->sentence,
        ];
    }
}
