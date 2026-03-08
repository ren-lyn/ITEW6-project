<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Faculty;

class ProfileCompletionController extends Controller
{
    // Retrieve the profile completion completeness score
    // Since Phase 2 demands we calculate completion score, here is a simple implementation
    public function getScore(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $completionScore = 0;
        $missingFields = [];

        if ($role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            if ($student) {
                // Check basic fields
                $fieldsToCheck = ['first_name', 'last_name', 'gender', 'birthdate', 'present_address', 'contact_number', 'email'];
                $filledCount = 0;

                foreach ($fieldsToCheck as $field) {
                    if (!empty($student->{$field})) {
                        $filledCount++;
                    } else {
                        $missingFields[] = $field;
                    }
                }

                // Check academic records based on phase 2 (Course / Program, Year Level, Section)
                $academicRecord = $student->academicRecords()->first();
                $academicFields = ['course', 'year_level', 'section'];
                foreach ($academicFields as $field) {
                    if ($academicRecord && !empty($academicRecord->{$field})) {
                        $filledCount++;
                    } else {
                        $missingFields[] = "academic_" . $field;
                    }
                }

                $totalRequired = count($fieldsToCheck) + count($academicFields);
                $completionScore = ($totalRequired > 0) ? round(($filledCount / $totalRequired) * 100) : 0;
            }
        } elseif ($role === 'faculty') {
            $faculty = Faculty::where('user_id', $user->id)->first();
            if ($faculty) {
                $fieldsToCheck = ['first_name', 'last_name', 'gender', 'birthdate', 'address', 'contact_number', 'email', 'department', 'employment_status'];
                $filledCount = 0;

                foreach ($fieldsToCheck as $field) {
                    if (!empty($faculty->{$field})) {
                        $filledCount++;
                    } else {
                        $missingFields[] = $field;
                    }
                }

                $totalRequired = count($fieldsToCheck);
                $completionScore = ($totalRequired > 0) ? round(($filledCount / $totalRequired) * 100) : 0;
            }
        }

        return response()->json([
            'completion_score' => $completionScore,
            'missing_fields' => $missingFields,
        ]);
    }
}
