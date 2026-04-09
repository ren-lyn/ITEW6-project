<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Skill;
use App\Models\Organization;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class PendingAccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $password = Hash::make('password');

        // Available skills and organizations
        $skillNames = ['PHP', 'Laravel', 'React', 'SQL', 'JavaScript', 'Python', 'Java', 'UI/UX Design', 'C++', 'Tailwind CSS'];
        $proficiencies = ['Beginner', 'Intermediate', 'Expert'];
        
        $orgNames = ['CCS Student Council', 'Google Developer Student Clubs', 'Game Development Group', 'Data Science Society', 'Cybersecurity Club'];
        $orgRoles = ['Member', 'Officer', 'President', 'Vice President'];

        // Fresh Data: Wipe previous pending users
        $pendingUsers = User::where('status', 'pending')->get();
        foreach ($pendingUsers as $u) {
            $u->forceDelete();
        }

        // Create 20 pending students
        for ($i = 0; $i < 20; $i++) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $email = strtolower($firstName . '.' . $lastName . '@student.example.com');
            
            // Ensure unique email
            while (User::where('email', $email)->exists() || User::withTrashed()->where('email', $email)->exists()) {
                $email = strtolower($firstName . '.' . $lastName . rand(1, 100) . '@student.example.com');
            }

            $user = User::create([
                'name' => "$firstName $lastName",
                'email' => $email,
                'password' => $password,
                'role' => 'student',
                'status' => 'pending',
                'must_change_password' => true,
            ]);

            $student = Student::create([
                'id_number' => 'STU-' . gmdate('Y') . '-' . str_pad($faker->unique()->randomNumber(5), 5, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'contact_number' => $faker->phoneNumber,
                'gender' => $faker->randomElement(['Male', 'Female']),
                'birthdate' => $faker->dateTimeBetween('-25 years', '-18 years')->format('Y-m-d'),
                'present_address' => $faker->address,
            ]);

            // Assign 2-4 Random Skills
            $numSkills = $faker->numberBetween(2, 4);
            $selectedSkills = $faker->randomElements($skillNames, $numSkills);
            foreach ($selectedSkills as $skillName) {
                // Determine if we need skill_id or id in firstOrCreate
                // Since skill model uses skill_id as PK, but firstOrCreate with skill_name works regardless of PK,
                $skill = Skill::firstOrCreate(['skill_name' => $skillName]);
                $student->skills()->attach($skill->skill_id ?? $skill->id, [
                    'proficiency_level' => $faker->randomElement($proficiencies)
                ]);
            }

            // Assign 1-2 Random Affiliations
            $numOrgs = $faker->numberBetween(1, 2);
            $selectedOrgs = $faker->randomElements($orgNames, $numOrgs);
            foreach ($selectedOrgs as $orgName) {
                // Model uses org_id as PK
                $org = Organization::firstOrCreate(['org_name' => $orgName]);
                $student->organizations()->attach($org->org_id ?? $org->id, [
                    'position' => $faker->randomElement($orgRoles),
                    'years_active' => $faker->numberBetween(1, 3)
                ]);
            }
        }

        // Create 10 pending faculty
        for ($i = 0; $i < 10; $i++) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;
            $email = strtolower($firstName . '.' . $lastName . '@faculty.example.com');
            
            // Ensure unique email
            while (User::where('email', $email)->exists() || User::withTrashed()->where('email', $email)->exists()) {
                $email = strtolower($firstName . '.' . $lastName . rand(1, 100) . '@faculty.example.com');
            }

            $user = User::create([
                'name' => "$firstName $lastName",
                'email' => $email,
                'password' => $password,
                'role' => 'faculty',
                'status' => 'pending',
                'must_change_password' => true,
            ]);

            Faculty::create([
                'id_number' => 'FAC-' . gmdate('Y') . '-' . str_pad($faker->unique()->randomNumber(4), 4, '0', STR_PAD_LEFT),
                'user_id' => $user->id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'contact_number' => $faker->phoneNumber,
                'gender' => $faker->randomElement(['Male', 'Female']),
                'birthdate' => $faker->dateTimeBetween('-50 years', '-30 years')->format('Y-m-d'),
                'address' => $faker->address,
                'department' => $faker->randomElement(['Computer Science', 'Information Technology', 'Information Systems']),
                'rank' => $faker->randomElement(['Instructor I', 'Assistant Professor I', 'Associate Professor I']),
            ]);
        }
    }
}
