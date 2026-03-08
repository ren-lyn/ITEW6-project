<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getStudentsReport()
    {
        // Total active students vs archived
        $totalActive = User::where('role', 'student')->count();
        $totalArchived = User::where('role', 'student')->onlyTrashed()->count();

        // Data directly from students table combined with related models
        $students = Student::with(['user', 'academicRecords'])->get();

        // Program distribution
        $programDistribution = [];
        foreach ($students as $student) {
            $record = $student->academicRecords->first();
            $course = $record->course ?? 'Unassigned';
            if (!isset($programDistribution[$course])) {
                $programDistribution[$course] = 0;
            }
            $programDistribution[$course]++;
        }

        return response()->json([
            'summary' => [
                'total_active' => $totalActive,
                'total_archived' => $totalArchived,
            ],
            'program_distribution' => $programDistribution,
            'students_data' => $students->map(function ($s) {
                return [
                    'id' => $s->user_id,
                    'name' => $s->user->name ?? 'N/A',
                    'email' => $s->user->email ?? 'N/A',
                    'course' => $s->academicRecords->first()->course ?? 'Unassigned',
                    'joined_at' => $s->created_at->format('Y-m-d')
                ];
            })
        ]);
    }

    public function getFacultyReport()
    {
        $totalActive = User::where('role', 'faculty')->count();
        $totalArchived = User::where('role', 'faculty')->onlyTrashed()->count();

        $faculty = Faculty::with(['user'])->get();

        $deptDistribution = [];
        foreach ($faculty as $fac) {
            $dept = $fac->department ?? 'Unassigned';
            if (!isset($deptDistribution[$dept])) {
                $deptDistribution[$dept] = 0;
            }
            $deptDistribution[$dept]++;
        }

        return response()->json([
            'summary' => [
                'total_active' => $totalActive,
                'total_archived' => $totalArchived,
            ],
            'department_distribution' => $deptDistribution,
            'faculty_data' => $faculty->map(function ($f) {
                return [
                    'id' => $f->user_id,
                    'name' => $f->user->name ?? 'N/A',
                    'email' => $f->user->email ?? 'N/A',
                    'department' => $f->department ?? 'Unassigned',
                    'status' => $f->employment_status ?? 'Unknown',
                    'joined_at' => $f->created_at->format('Y-m-d')
                ];
            })
        ]);
    }
}
