<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\ChatHistory;
use App\Models\BotMan;

class ChatHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 3; $i++) {
            ChatHistory::factory()->create([
                'user_id' => rand(2, 4),
                'botman_id' => 1,  
            ]);
        }

        for ($i = 0; $i < 2; $i++) {
            ChatHistory::factory()->create([
                'user_id' => rand(2, 4),
                'botman_id' => 2,  
            ]);
        }

        for ($i = 0; $i < 1; $i++) {
            ChatHistory::factory()->create([
                'user_id' => rand(2, 4),
                'botman_id' => 3,  
            ]);
        }


        $botmanIds = [4,5,6];

        foreach ($botmanIds as $botmanId) {
            $numberOfCalls = BotMan::find($botmanId)->number_of_calls;

            for ($i = 0; $i < $numberOfCalls; $i++) {
                ChatHistory::factory()->create([
                    'user_id' => rand(2, 4),
                    'botman_id' => $botmanId,
                ]);
            }
        }


    }
}
