<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DashboardStatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = \App\Models\Student::all();
        $courses = ['BSIT', 'BSCS', 'BSIS'];
        $standings = ['Regular', 'Irregular', 'Probation', 'Warning'];
        
        foreach ($students as $student) {
            if (!\App\Models\AcademicRecord::where('student_id', $student->student_id)->exists()) {
                \App\Models\AcademicRecord::create([
                    'student_id' => $student->student_id,
                    'course' => $courses[array_rand($courses)],
                    'year_level' => rand(1, 4),
                    'gwa' => number_format(rand(100, 300) / 100, 2),
                    'academic_standing' => rand(1, 100) > 80 ? 'Probation' : $standings[array_rand($standings)],
                ]);
            }

            if (!\App\Models\BehavioralProfile::where('student_id', $student->student_id)->exists()) {
                \App\Models\BehavioralProfile::create([
                    'student_id' => $student->student_id,
                    'attendance_percentage' => rand(1, 100) > 85 ? rand(50, 74) : rand(75, 100),
                ]);
            }

            if (!\App\Models\Guardian::where('student_id', $student->student_id)->exists()) {
                \App\Models\Guardian::create([
                    'student_id' => $student->student_id,
                    'family_income_bracket' => rand(1, 100) > 85 ? 'Below 10,000' : 'Above 10,000',
                ]);
            }
        }
    }
}
