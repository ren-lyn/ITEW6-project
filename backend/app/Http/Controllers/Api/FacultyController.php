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

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department')) {
            $query->where('department', $request->input('department'));
        }

        if ($request->filled('rank')) {
            $query->where('rank', $request->input('rank'));
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        return \DB::transaction(function() use ($request) {
            // 1. Automatically Create User Account
            $user = \App\Models\User::firstOrCreate(
                ['email' => $request->email],
                [
                    'name' => $request->first_name . ' ' . $request->last_name,
                    'password' => \Hash::make($request->employee_id), // Default password is ID
                    'role' => 'faculty',
                    'must_change_password' => true
                ]
            );

            // 2. Create Faculty Record
            $facultyData = $request->all();
            $facultyData['user_id'] = $user->id;
            $faculty = Faculty::create($facultyData);
            
            return response()->json($faculty->load('user'), 201);
        });
    }

    public function show(Faculty $faculty)
    {
        return response()->json($faculty->load(['materials', 'user']));
    }

    public function update(Request $request, Faculty $faculty)
    {
        return \DB::transaction(function() use ($request, $faculty) {
            if ($faculty->user) {
                $faculty->user->update([
                    'name' => ($request->first_name ?? $faculty->first_name) . ' ' . ($request->last_name ?? $faculty->last_name),
                    'email' => $request->email ?? $faculty->email
                ]);
            }
            
            $faculty->update($request->all());
            return response()->json($faculty->load('user'));
        });
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
