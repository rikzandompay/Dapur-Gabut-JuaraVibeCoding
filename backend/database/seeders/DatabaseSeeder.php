<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Dummy User 1: Admin / Chef Rikzan
        User::factory()->create([
            'name'  => 'Chef Rikzan',
            'email' => 'rikzan@dapurgabut.com',
        ]);

        // Dummy User 2: Regular User
        User::factory()->create([
            'name'  => 'Dapur Gabut',
            'email' => 'gabut@dapurgabut.com',
        ]);
    }
}
