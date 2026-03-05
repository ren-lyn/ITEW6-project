<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $query = Faculty::with(['user']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        if ($request->has('department')) {
            $query->where('department', $request->input('department'));
        }

        if ($request->has('academic_rank')) {
            $query->where('academic_rank', $request->input('academic_rank'));
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $faculty = Faculty::create($request->all());
        return response()->json($faculty, 201);
    }

    public function show(Faculty $faculty)
    {
        return response()->json($faculty->load(['materials', 'user']));
    }

    public function update(Request $request, Faculty $faculty)
    {
        $faculty->update($request->all());
        return response()->json($faculty);
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
