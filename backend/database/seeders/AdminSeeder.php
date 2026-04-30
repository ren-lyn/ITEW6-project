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
        // Use updateOrCreate so it forces the password/status to be correct even if the user already exists
        User::updateOrCreate(
            ['email' => 'admin@ccs.edu'],
            [
                'name' => 'CCS Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'approved',
                'must_change_password' => false,
            ]
        );

        User::updateOrCreate(
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
