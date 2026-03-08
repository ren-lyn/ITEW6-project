<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Event;
use App\Models\Research;
use App\Models\AcademicRecord;
use App\Models\BehavioralProfile;
use App\Models\Guardian;
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
        $studentByCourse = AcademicRecord::select('course', DB::raw('count(*) as total'))
            ->whereNotNull('course')
            ->groupBy('course')
            ->get();

        // Statistics by Academic Standing
        $standingSummary = AcademicRecord::select('academic_standing', DB::raw('count(*) as total'))
            ->whereNotNull('academic_standing')
            ->groupBy('academic_standing')
            ->get();

        // Risk indicators summary (Improved logic)
        $riskSummary = [
            'academic_risk' => AcademicRecord::where('academic_standing', 'Probation')->count(),
            'attendance_risk' => BehavioralProfile::where('attendance_percentage', '<', 75)->count(),
            'financial_concern' => Guardian::where('family_income_bracket', 'Below 10,000')->orWhere('family_income_bracket', 'Below PHP 10,000')->count(),
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
