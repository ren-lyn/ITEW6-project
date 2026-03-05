<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Event;
use App\Models\Research;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStudents = Student::count();
        $totalFaculty = Faculty::count();
        $totalResearch = Research::count();
        $upcomingEvents = Event::where('event_date', '>=', now())->count();

        // Statistics by course
        $studentByCourse = Student::select('course', DB::raw('count(*) as total'))
            ->groupBy('course')
            ->get();

        // Statistics by Academic Standing
        $standingSummary = Student::select('academic_standing', DB::raw('count(*) as total'))
            ->groupBy('academic_standing')
            ->get();

        // Risk indicators summary (Improved logic)
        $riskSummary = [
            'academic_risk' => Student::where('academic_standing', 'Probation')->count(),
            'attendance_risk' => Student::where('behavioral_info_json->attendance_pattern', 'Irregular')->count(),
            'financial_concern' => Student::where('family_info_json->income_bracket', 'Below PHP 10,000')->count(),
        ];

        return response()->json([
            'stats' => [
                'total_students' => $totalStudents,
                'total_faculty' => $totalFaculty,
                'total_research' => $totalResearch,
                'upcoming_events' => $upcomingEvents,
            ],
            'charts' => [
                'students_by_course' => $studentByCourse,
                'standing_summary' => $standingSummary,
                'risk_summary' => $riskSummary
            ]
        ]);
    }
}
