<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use firstOrCreate so it doesn't crash if it runs multiple times
        User::firstOrCreate(
            ['email' => 'admin@ccs.edu'],
            [
                'name' => 'CCS Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'approved',
                'must_change_password' => false,
            ]
        );

        User::firstOrCreate(
            ['email' => 'dean@ccs.edu'],
            [
                'name' => 'CCS Dean',
                'password' => Hash::make('password'),
                'role' => 'dean',
                'status' => 'approved',
                'must_change_password' => false,
            ]
        );
    }
}
