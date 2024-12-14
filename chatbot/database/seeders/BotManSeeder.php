<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\BotMan;

class BotManSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BotMan::create([
            'botman_name'=>"Robo 1",
            'number_of_calls'=> 3,
        ]);

        BotMan::create([
            'botman_name'=>"Robo 2",
            'number_of_calls'=> 2,
        ]);

        BotMan::create([
            'botman_name'=>"Robo 3",
            'number_of_calls'=> 1,
        ]);

        BotMan::factory()->times(3)->create();

        BotMan::create([
            'botman_name'=>"Robit",
            'number_of_calls'=> 0,
        ]);
        
        BotMan::create([
            'botman_name'=>"Robit",
            'number_of_calls'=> 0,
        ]);

        BotMan::create([
            'botman_name'=>"Robit",
            'number_of_calls'=> 0,
        ]);
    }
}
