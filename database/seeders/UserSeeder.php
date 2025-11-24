<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       {/*  $developerUser = User::create([
            'name' => 'Dev User',
            'email' => 'dev@teamspan.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $developerUser->assignRole('Developer'); */}

        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@ordering.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $adminUser->assignRole('Admin');

        $userUser = User::create([
            'name' => 'User User',
            'email' => 'user@ordering.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $userUser->assignRole('User');
    }
}

