<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['user', 'event']);

        if ($request->has('type')) {
            $query->where('schedule_type', $request->input('type'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $schedule = Schedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['user', 'event']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $schedule->update($request->all());
        return response()->json($schedule);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
