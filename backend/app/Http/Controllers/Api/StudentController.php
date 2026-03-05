<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['user']);

        // Advanced Search & Filtering
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        if ($request->has('course')) {
            $query->where('course', $request->input('course'));
        }
        if ($request->has('year_level')) {
            $query->where('year_level', $request->input('year_level'));
        }
        if ($request->has('min_gwa')) {
            $query->where('overall_gwa', '<=', $request->input('min_gwa')); // Lower is better
        }
        if ($request->has('deans_list')) {
            $query->where('deans_list', filter_var($request->input('deans_list'), FILTER_VALIDATE_BOOLEAN));
        }

        // JSON field filtering examples
        if ($request->has('skill')) {
            $query->whereJsonContains('skills_json', $request->input('skill'));
        }
        if ($request->has('talent')) {
            $query->whereJsonContains('talents_json', $request->input('talent'));
        }
        if ($request->has('classification')) {
            $query->whereJsonContains('classifications_json', $request->input('classification'));
        }

        // Height filter
        if ($request->has('min_height')) {
            $query->where('height', '>=', $request->input('min_height'));
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $student = Student::create($request->all());
        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['medicalRecords', 'violations', 'achievements']));
    }

    public function addViolation(Request $request, Student $student)
    {
        $validated = $request->validate([
            'violation_type' => 'required|string',
            'severity_level' => 'required|string',
            'sanction_given' => 'nullable|string',
        ]);

        $violation = $student->violations()->create($validated);

        return response()->json($violation, 201);
    }

    public function update(Request $request, Student $student)
    {
        $student->update($request->all());
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
