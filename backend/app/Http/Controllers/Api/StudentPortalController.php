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


}
