<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class StudentPortalController extends Controller
{
    public function getSchedule(Request $request)
    {
        $student = auth()->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        $academic = $student->academicRecords()->latest()->first();
        if (!$academic) {
            return response()->json(['message' => 'Academic record not found'], 404);
        }

        // Filter schedules matching student's section and year level
        $schedules = Schedule::with(['faculty.user'])
            ->where('section', $academic->section)
            ->where('year_level', $academic->year_level)
            ->where('schedule_type', 'Class')
            ->get();

        return response()->json([
            'academic' => $academic,
            'schedules' => $schedules
        ]);
    }

    public function getEnrolledCourses(Request $request)
    {
        $student = auth()->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        $academic = $student->academicRecords()->latest()->first();
        if (!$academic) {
            return response()->json(['message' => 'Academic record not found. Please ensure your profile is complete.'], 404);
        }

        // Get unique subjects from the schedule for their section/year
        // In a real system, there should be an 'enrollments' table mapping students to specific schedule IDs.
        // For this profiling system, we derive it from the section matching.
        $subjects = Schedule::where('section', $academic->section)
            ->where('year_level', $academic->year_level)
            ->where('schedule_type', 'Class')
            ->select('subject_code', 'title')
            ->distinct()
            ->get();

        return response()->json([
            'academic' => $academic,
            'courses' => $subjects
        ]);
    }

    public function getRegistrationData(Request $request)
    {
        $user = auth()->user();
        $student = $user->student->load(['guardians']);
        
        if (!$student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        $academic = $student->academicRecords()->latest()->first();
        
        $schedules = [];
        if ($academic) {
            $schedules = Schedule::with(['faculty.user'])
                ->where('section', $academic->section)
                ->where('year_level', $academic->year_level)
                ->where('schedule_type', 'Class')
                ->get();
        }

        return response()->json([
            'student' => $student,
            'user' => $user,
            'academic' => $academic,
            'enrolled_subjects' => $schedules,
            'registration_date' => $student->created_at->format('M d, Y'),
            'semester' => $academic ? $academic->semester : 'N/A',
            'academic_year' => date('Y') . '-' . (date('Y') + 1)
        ]);
    }
}
