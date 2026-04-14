<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Attendance;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        $subjects = ['Web Development', 'Database Management', 'Computer Programming', 'Networking', 'Cybersecurity'];
        $statuses = ['Present', 'Absent', 'Late'];
        $remarks = ['On time', 'With medical notice', 'Late due to traffic', 'Systematic error', 'Emergency'];

        if ($students->isEmpty()) {
            $this->command->info('No students found to seed attendance for.');
            return;
        }

        foreach ($students as $student) {
            // Get the student's current section for seeding
            $academicRecord = $student->academicRecords()->latest()->first();
            $section = $academicRecord ? $academicRecord->section : '1IT-A';

            // Create 3-5 attendance records for each student
            $recordCount = rand(3, 8);

            for ($i = 0; $i < $recordCount; $i++) {
                Attendance::create([
                    'student_id' => $student->student_id,
                    'subject' => $subjects[array_rand($subjects)],
                    'section' => $section,
                    'date' => date('Y-m-d', strtotime('-' . rand(0, 30) . ' days')),
                    'status' => $statuses[array_rand($statuses)],
                    'remarks' => rand(0, 1) ? $remarks[array_rand($remarks)] : null
                ]);
            }
        }

        $this->command->info('Attendance records seeded successfully.');
    }
}
